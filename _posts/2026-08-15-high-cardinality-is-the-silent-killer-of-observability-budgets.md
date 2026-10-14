---
layout: post
title: "High cardinality is the silent killer of observability budgets"
description: "One innocent tag can explode into millions of billable time series. How dropping high-cardinality labels at scrape time can cut observability spend dramatically."
date: 2026-08-15
---

**TL;DR:** Everyone loves adding custom tags to their logs and metrics right up until the high cardinality of your labels multiply into millions of billable time series. Fixing (and preventing) this requires strict engineering discipline.

The core issue with managed tools like DataDog isn't always the base pricing—it's how they calculate custom metrics. A single metric is defined by the unique combination of the metric name, tags, and host. This means cardinality is multiplicative. If you have 50 microservices and you decide to add a `request_id` tag to a core metric processing millions of requests, you haven't just added a label; you've instantly created millions of unique, billable time series.

## The Forced Cleanup

When I architected our migration away from DataDog to a custom Loki, Grafana, and Prometheus stack hosted on AWS, the goal was cost reduction. We ended up slashing our monthly observability costs by roughly 90% across our cloud and on-premise infrastructure. But looking back, the most valuable part of that migration wasn't swapping the infrastructure itself - it was the forced cleanup of what we were actually indexing.

Self-hosting Prometheus forces you to confront your cardinality directly because if you don't, your own instances will simply run out of memory. You realize very quickly that a massive portion of ingested series are never actually used in any dashboard or alert.

## Dropping the Weight at Scrape Time

To maintain that 90% cost reduction and keep our AWS backend running efficiently, we had to enforce strict lifecycle boundaries on our metrics.

Instead of ingesting every unique identifier, you drop high-churn, high-cardinality labels before they ever reach storage. In Prometheus, you handle this at scrape time using `metric_relabel_configs`.

Here is a realistic snippet of how you strip out expensive labels like `pod_name` or temporary revision hashes before they bloat your TSDB:

```yaml
# prometheus.yml snippet
scrape_configs:
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod

    # Drop high-cardinality labels before ingestion to save memory and storage
    metric_relabel_configs:
      - action: labeldrop
        regex: "pod_name|replicaset|controller_revision_hash|request_id"

      # Alternatively, drop entire metric families that nobody queries
      - source_labels: [__name__]
        regex: "go_memstats_.*_bytes"
        action: drop
```

By explicitly dropping these labels, Prometheus aggregates the data, and your millions of unique series collapse back down into a manageable, queryable dataset. Observability should mean answering specific operational questions, not hoarding every possible data point.
