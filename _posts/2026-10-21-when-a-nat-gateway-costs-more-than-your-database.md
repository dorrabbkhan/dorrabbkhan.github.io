---
layout: post
title: "When a NAT Gateway costs more than your database"
description: "NAT Gateway costs aren't a networking bug - they're an ownership failure. How to eliminate the AWS egress tax using free Gateway Endpoints, PrivateLink routing, and explicit ADR rules."
date: 2026-10-21
tags: [aws, finops, networking]
---

**TL;DR:** NAT Gateway costs aren't a networking bug - they're an ownership failure. When infrastructure traffic is lumped into a shared networking line, nobody notices that gigabytes of internal AWS traffic are quietly paying a steep middleman tax. You can eliminate the vast majority of this spend using free Gateway Endpoints, deliberate interface routing, and a single rule in your Architecture Decision Records (ADRs).

The platform team created our NAT Gateway once in a base VPC module and never touched it again. Product teams generated a significant amount of egress every deploy, but never saw the cost because it landed on a shared infrastructure line. Everybody simply saw "EC2-Other" climbing on the monthly invoice without knowing what it meant.

### The Arithmetic of Invisible Egress

A managed NAT Gateway charges an hourly uptime fee (~$0.045/hour in us-east-1, slightly higher in European regions like Frankfurt at ~$0.052/hour), plus an identical per-gigabyte data processing fee.

That doesn't sound punishing until you look at what's actually traversing it. Every time an ECS task pulls a container image from ECR, queries an S3 bucket, or pushes logs to CloudWatch from a private subnet, AWS treats that traffic as external egress through the NAT unless told otherwise. You end up paying a per-GB processing fee on your own internal data.

To see what is actually hitting the gateway, avoid guessing. Run a quick CloudWatch Logs Insights query over your VPC Flow Logs on the NAT's Elastic Network Interface (ENI):

```sql
fields @timestamp, srcAddr, dstAddr, bytes
| stats sum(bytes) as totalBytes by dstAddr
| sort totalBytes desc
| limit 10
```

Nine times out of ten, the top talkers aren't public third-party APIs. They are AWS service endpoints.

### The Fixes, Ranked by Effort

Fixing this isn't about re-architecting your entire network. It's simply about taking the traffic off the NAT's payroll:

#### 1. S3 and DynamoDB Gateway Endpoints (Zero Cost)

AWS provides Gateway Endpoints for S3 and DynamoDB completely free of charge. There is zero hourly fee and zero data processing charge. Adding one updates your subnet route tables so traffic to S3 stays on the AWS private network:

```hcl
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = aws_route_table.private[*].id
}
```

If your applications read datasets, media, or run heavy data lifecycles against S3, this single block drops your NAT data volume immediately.

#### 2. Interface Endpoints (Run the Math First)

For ECR, CloudWatch, and Secrets Manager, AWS offers Interface Endpoints (PrivateLink). These are *not* free - they cost around $0.01 per AZ per hour plus ~$0.01 per GB processed.

Do the break-even math before spinning them up: if a service processes 1 TB of image pulls a month, routing that through PrivateLink ($10) is vastly cheaper than routing it through a NAT Gateway ($45-$52). For low-traffic APIs, the idle hourly cost of the endpoint might exceed the NAT savings.

#### 3. Image Hygiene and Cross-AZ Hops

Shrink your container images and take advantage of ECS pull-through caches so tasks aren't constantly pulling multi-gigabyte layers on deploy.

Additionally, watch your Availability Zone alignment. If a task in `eu-central-1a` routes through a NAT Gateway in `eu-central-1b`, you get billed for cross-AZ data transfer *and* NAT processing. AWS's Regional NAT Gateway mode simplifies management across AZs, but remember that it still bills hourly for each AZ it covers - it is an operational abstraction, not a cost cut.

### Make Egress an Explicit Architecture Choice

The only way to keep this spend under control permanently is to give network egress an owner:

1. **Tag the NAT and endpoints:** Assign the cost explicitly to the core platform budget instead of leaving it in shared unallocated buckets.
2. **Set a threshold alert:** Add an AWS Budget alert specifically filtered on the `NatGateway-Bytes` usage type to catch rogue egress spikes before the invoice arrives.
3. **Update your ADR template:** Make "Network Egress Path" a required field in your Architecture Decision Records. Whenever an engineer introduces a service pulling high volumes of external or AWS data, they must document whether it routes via Gateway Endpoints, PrivateLink, or public subnets. This can be an overkill, especially depending on the team size and culture, so YMMV.
