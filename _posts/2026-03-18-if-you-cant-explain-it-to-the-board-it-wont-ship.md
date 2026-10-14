---
layout: post
title: "If you can't explain it to the Board, it won't ship"
description: "The hardest part of senior engineering isn't the code - it's translating technical trade-offs into cost, risk, and speed for stakeholders. A framework and ADR blueprint for winning buy-in."
date: 2026-03-18
---

**TL;DR:** The hardest part of an engineering role isn't writing the code; it's translating technical trade-offs to people who only care about the bottom line. You can design the most elegant system in the world, but it won't ship if you can't get stakeholder buy-in. It is crucual to have a framework for translating complex cloud infrastructure changes that bridge the gap between engineering and the business.

We spend years mastering our tech stack, but almost zero time learning how to talk about it. When you transition into a senior role, the bottleneck stops being your ability to write a Terraform module. The real bottleneck becomes your ability to explain _why_ that module is necessary to a stakeholder who just wants the feature shipped, or a Board staring at a massive cloud bill.

## The Translation Framework

When you talk to non-technical stakeholders, you have to completely drop the engineering jargon and focus exclusively on business impact: cost, risk, and speed.

For example, when I architected the migration of our observability stack away from DataDog to a custom Loki, Grafana, and Prometheus setup on AWS, I didn't pitch the stakeholders on the technical elegance of PromQL. I pitched them on the fact that this move would slash our monthly observability costs by up to 90%.

To win technical arguments, frame them as business solutions. If you want to spend two sprints paying down technical debt, explain how it directly translates to faster feature delivery or a reduction in SLA breaches next quarter.

Over time, I also noticed that metaphors do a lot of the heavy lifting in these conversations. Stakeholders don't need the precise mechanics; they need a mental model they can reason with. A well-chosen metaphor hands them that model in seconds, and once they have it, all the relevant technical details you present actually stick.

## A blueprint for business-driven ADRs

A good Architecture Decision Record (ADR) shouldn't just be a log of what the engineering team decided to do. It needs to be a document that translates complex technical reality into clear business context.

Here is the straightforward ADR format I would recommend to ensure both developers and the business are aligned:

```markdown
# ADR [004]: Migrating Observability Stack to Loki/Prometheus

**1. The Business Problem**
Our current SaaS monitoring costs are scaling linearly with our traffic, currently eating up X% of our monthly infrastructure budget and hurting product margins.

**2. The Technical Decision**
We will migrate our primary observability pipeline from DataDog to a self-hosted Loki, Grafana, and Prometheus stack on AWS.

**3. The Bottom-Line Impact**

- **Pros:** Projected 90% reduction in monthly observability costs. Total control over data retention policies.
- **Cons (Trade-offs):** Requires approximately 4 weeks of dedicated engineering time to build. Introduces minor ongoing maintenance overhead for the DevOps team.

**4. The Rollout Strategy**
Run both systems in parallel for 14 days to validate metrics, then tear down the legacy system.
```

By explicitly listing the business problem first and clearly defining the trade-offs (including engineering time), you eliminate the friction between engineering and management. You give the board exactly what they need to make an informed decision, and you give your team the air cover they need to actually do the work.
