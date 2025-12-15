---
layout: page
title: 碎碎念
permalink: /thoughts.html
---

<div class="timeline">
  {% for thought in site.data.thoughts %}
  <div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <time>{{ thought.date }}</time>
      <p>{{ thought.content }}</p>
      {% if thought.tags %}
      <div class="tags">
        {% for tag in thought.tags %}
        <span class="tag">{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>
