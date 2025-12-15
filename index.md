---
layout: default
title: 首页
---

<div class="profile">
  <h1>欢迎来到我的个人主页</h1>
  <p class="bio">全栈开发者 | 开源爱好者 | 终身学习者</p>

  <div class="social-links">
    <a href="https://github.com/yourusername" target="_blank">GitHub</a>
    <a href="mailto:your@email.com">Email</a>
    <a href="https://twitter.com/yourusername" target="_blank">Twitter</a>
  </div>
</div>

<div class="content-section">
  <h2>关于我</h2>
  <p>你好！我是一名热爱编程的开发者，专注于 Web 全栈开发。</p>

  <p><strong>技能栈：</strong></p>
  <ul>
    <li>前端：React、Vue、TypeScript</li>
    <li>后端：Node.js、Python、Go</li>
    <li>数据库：MySQL、PostgreSQL、MongoDB</li>
    <li>工具：Git、Docker、CI/CD</li>
  </ul>

  <p><strong>当前在做：</strong></p>
  <ul>
    <li>开发开源项目</li>
    <li>学习分布式系统设计</li>
    <li>撰写技术博客</li>
  </ul>
</div>

<div class="content-section">
  <h2>最近更新</h2>
  <ul class="doc-list">
    {% for doc in site.docs limit:5 %}
    <li>
      <a href="{{ doc.url }}">{{ doc.title }}</a>
      <span class="doc-meta">{{ doc.date | date: "%Y-%m-%d" }}</span>
    </li>
    {% endfor %}
  </ul>
</div>
