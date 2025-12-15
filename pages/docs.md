---
layout: page
title: 知识库
permalink: /docs.html
---

<h2>知识库</h2>

<div class="docs-navigation">
  {% assign docs_by_category = site.docs | group_by: "category" %}

  {% for category in docs_by_category %}
  <div class="doc-category">
    <h3>{{ category.name }}</h3>
    <ul class="doc-list">
      {% for doc in category.items %}
      <li>
        <a href="{{ doc.url }}">{{ doc.title }}</a>
        <span class="doc-meta">{{ doc.date | date: "%Y-%m-%d" }}</span>
      </li>
      {% endfor %}
    </ul>
  </div>
  {% endfor %}
</div>
