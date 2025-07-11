---
title:
layout: default
permalink: /tools/
published: true
---

<div class="ProjectContainer">

{% for tool in site.tools %}

    <div class="project-preview">
      <a href="{{ tool.url | prepend: site.baseurl | prepend: site.url }}">
        <span>
            <h2>{{ tool.title }}</h2>
        </span>
      </a>
      <p>{{ tool.description }}</p>
    </div>
    <hr/>

{% endfor %}

</div>
