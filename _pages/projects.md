---
title:
layout: default
permalink: /projects/
published: true
---

<div class="ProjectContainer">

{% for project in site.projects %}

    <div class="project-preview">
      <a href="{{ project.url | prepend: site.baseurl | prepend: site.url }}">
        <span>
            <h2>{{ project.title }}</h2>
        </span>
      </a>
      <p>{{ project.description }}</p>
    </div>
    <hr/>

{% endfor %}

</div>
