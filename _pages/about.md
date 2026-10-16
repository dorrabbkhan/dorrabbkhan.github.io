---
layout: default
title: About
permalink: /about/
---

<div class="about">

<img
  class="about-photo"
  src="{{ '/assets/images/personal-photo.png' | relative_url }}"
  alt="Portrait of Dorrabb Khan"
/>

<div markdown="1">

I'm **Dorrabb Khan** — a **Senior DevOps & Cloud Engineer** in _Munich, Germany_. I currently lead product development, cloud infrastructure and DevOps at [adnymics/ParcelDealz](https://www.linkedin.com/company/adnymics/), where I've grown from working student to senior engineer over five years.

Alongside work I'm doing a part-time **MSc in Artificial Intelligence** at FAU Erlangen-Nürnberg — cloud systems by day, neural networks by night. Off the clock it's football, the gym, bouldering, and [Ilm Abroad Pakistan](#community).

</div>

<hr />

<h2 class="about-heading">Experience</h2>

<div class="timeline">
  <div class="timeline-item">
    <p class="timeline-role">Senior DevOps Engineer</p>
    <p class="post-meta timeline-meta">
      adnymics / ParcelDealz GmbH · Munich · Jan 2020 – Present
    </p>
    <ul>
      <li>
        Designed and scaled the cloud-native AWS backend (ECS, RDS, S3,
        Lambda, Route53) behind a SaaS platform serving
        <strong>60+ enterprise clients</strong> —
        <strong>2.5M+ requests/month</strong> at 99.99% availability and
        sub-300ms latency.
      </li>
      <li>
        Cut core AWS spend <strong>~73%</strong> via FinOps (EC2/RDS
        rightsizing, Savings Plans, automated environment teardowns) and
        observability costs <strong>~90%</strong> by replacing DataDog with a
        self-hosted Loki/Grafana/Prometheus stack.
      </li>
      <li>
        Accelerated deployments <strong>~85%</strong> with automated CI/CD
        pipelines and containerised dev environments; migrated 14
        microservices off Python 2.7 and built a high-throughput Rust + SQS
        pipeline. Regularly present architecture decisions to the Board, CTO
        and 30+ colleagues in tech talks.
      </li>
    </ul>
    <p class="timeline-path">
      Working Student → Junior Software Engineer → DevOps Engineer →
      <strong>Senior DevOps Engineer</strong>
    </p>
  </div>
</div>

<hr />

<h2 class="about-heading">Skills &amp; Tools</h2>

<div class="skill-group">
  <p class="skill-label">Cloud</p>
  <div class="tag-pills">
    <span class="tag-pill">AWS</span>
    <span class="tag-pill">GCP</span>
    <span class="tag-pill">Firebase</span>
  </div>
</div>

<div class="skill-group">
  <p class="skill-label">Infrastructure as Code</p>
  <div class="tag-pills">
    <span class="tag-pill">Terraform</span>
    <span class="tag-pill">Ansible</span>
  </div>
</div>

<div class="skill-group">
  <p class="skill-label">Containers &amp; CI/CD</p>
  <div class="tag-pills">
    <span class="tag-pill">Docker</span>
    <span class="tag-pill">Kubernetes</span>
    <span class="tag-pill">AWS ECS</span>
    <span class="tag-pill">Jenkins</span>
    <span class="tag-pill">GitLab CI</span>
    <span class="tag-pill">GitHub Actions</span>
    <span class="tag-pill">Bitbucket Pipelines</span>
  </div>
</div>

<div class="skill-group">
  <p class="skill-label">Observability</p>
  <div class="tag-pills">
    <span class="tag-pill">Grafana</span>
    <span class="tag-pill">Loki</span>
    <span class="tag-pill">Prometheus</span>
    <span class="tag-pill">CloudWatch</span>
    <span class="tag-pill">DataDog</span>
  </div>
</div>

<div class="skill-group">
  <p class="skill-label">Languages</p>
  <div class="tag-pills">
    <span class="tag-pill">TypeScript</span>
    <span class="tag-pill">JavaScript</span>
    <span class="tag-pill">Python</span>
    <span class="tag-pill">Rust</span>
    <span class="tag-pill">C/C++</span>
    <span class="tag-pill">Bash</span>
  </div>
</div>

<div class="skill-group">
  <p class="skill-label">Frameworks &amp; Data</p>
  <div class="tag-pills">
    <span class="tag-pill">NestJS</span>
    <span class="tag-pill">Next.js</span>
    <span class="tag-pill">PostgreSQL</span>
    <span class="tag-pill">MySQL</span>
    <span class="tag-pill">Redis</span>
    <span class="tag-pill">Pandas</span>
    <span class="tag-pill">NumPy</span>
  </div>
</div>

<div class="skill-group">
  <p class="skill-label">Spoken Languages</p>
  <div class="tag-pills">
    <span class="tag-pill">English (C2)</span>
    <span class="tag-pill">German (B2)</span>
    <span class="tag-pill">Urdu</span>
    <span class="tag-pill">Pashto</span>
    <span class="tag-pill">Hindi</span>
  </div>
</div>

<hr />

<h2 class="about-heading">Education</h2>

<div class="timeline">
  <div class="timeline-item">
    <p class="timeline-role">MSc Artificial Intelligence (part-time)</p>
    <p class="post-meta timeline-meta">
      Friedrich-Alexander-Universität Erlangen-Nürnberg · Apr 2026 – Present
    </p>
    <p class="timeline-note">Current GPA: 1.23 (German scale)</p>
  </div>
  <div class="timeline-item">
    <p class="timeline-role">BSc Robotics and Intelligent Systems</p>
    <p class="post-meta timeline-meta">
      Constructor University Bremen (formerly Jacobs University) · Jan 2019 –
      Jun 2022
    </p>
    <p class="timeline-note">
      GPA 1.43 — summa cum laude, highest GPA in the major for the Class of
      2022
    </p>
  </div>
</div>

<hr />

<h2 class="about-heading" id="community">Community</h2>

<div class="timeline">
  <div class="timeline-item">
    <p class="timeline-role">Founder — Ilm Abroad Pakistan</p>
    <p class="post-meta timeline-meta">2025 – Present</p>
    <p class="timeline-desc">
      Educational project guiding students from Pakistan through university,
      scholarship and visa applications for Germany and Europe — 10+ students
      supported so far.
    </p>
  </div>
  <div class="timeline-item">
    <p class="timeline-role">
      Technical Lead — Google Developer Student Club
    </p>
    <p class="post-meta timeline-meta">
      Jacobs University Bremen · 2019 – 2022
    </p>
    <p class="timeline-desc">
      Mentored 80+ members and led the team that won Google's EU-wide DSC
      Ideathon 2022 and placed top 50 globally in the DSC Solutions Challenge
      2023. Also served as Engineering Focus Area Representative for 400+
      students and on the Student Parliament.
    </p>
  </div>
</div>

<hr />

<div class="cta-buttons">
  <a
    href="{{ '/assets/docs/CV-Muhammad_Dorrabb_Khan_Niazi-EN.pdf' | relative_url }}"
    target="_blank"
    rel="noopener noreferrer"
    >Get my CV</a
  >
  <a
    href="https://www.linkedin.com/in/dorrabbkhan"
    target="_blank"
    rel="noopener noreferrer"
    >Connect on LinkedIn</a
  >
</div>

</div>
