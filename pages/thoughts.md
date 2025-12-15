---
layout: page
title: 碎碎念
permalink: /thoughts.html
---

<div style="position: relative;">
  <div class="thoughts-plum">
    <img src="{{ '/assets/images/plum.svg' | relative_url }}" alt="梅花装饰">
  </div>

  <div class="timeline">
    {% assign sorted_thoughts = site.data.thoughts | sort: 'datetime' | reverse %}
    {% for thought in sorted_thoughts %}
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <time>{{ thought.datetime }}</time>
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
</div>
