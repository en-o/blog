---
layout: page
title: 友情链接
permalink: /links.html
---

<h2>友情链接</h2>

<div class="friends-links">
  {% for link in site.data.links %}
  <div class="link-card">
    <img src="{{ link.avatar }}" alt="{{ link.name }}">
    <div class="link-info">
      <h3><a href="{{ link.url }}" target="_blank">{{ link.name }}</a></h3>
      <p>{{ link.description }}</p>
    </div>
  </div>
  {% endfor %}
</div>

<div style="margin-top: 40px; padding: 20px; background: white; border-radius: 8px;">
  <h3>如何添加友链</h3>
  <p>如果你想交换友链，请提交 Issue 或 PR，格式如下：</p>
  <ul>
    <li>名称：你的名字</li>
    <li>链接：你的网站</li>
    <li>描述：一句话介绍</li>
    <li>头像：头像链接</li>
  </ul>
</div>
