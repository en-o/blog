---
layout: default
title: 首页
---

<!-- 个人简介卡片 -->
<div class="home-profile-card">
  <div class="profile-avatar">
    <img src="{{ site.data.profile.avatar }}" alt="{{ site.data.profile.name }}">
  </div>
  <div class="profile-info">
    <h1>{{ site.data.profile.name }}</h1>
    <p class="profile-bio">{{ site.data.profile.bio }}</p>
    <div class="profile-intro">{{ site.data.profile.intro }}</div>
    <div class="profile-social">
      {% if site.data.profile.social.github %}
      <a href="{{ site.data.profile.social.github }}" target="_blank">
        <svg height="16" width="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
        GitHub
      </a>
      {% endif %}
      {% if site.data.profile.social.email %}
      <a href="mailto:{{ site.data.profile.social.email }}">
        <svg height="16" width="16" viewBox="0 0 16 16"><path fill="currentColor" d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"></path></svg>
        Email
      </a>
      {% endif %}
    </div>
  </div>
  
   <!-- 新增：时钟模块 -->
  <div class="profile-clock">
    <div class="clock" id="homeClock"></div>
    <div class="clock-digital" id="clockDigital"></div>
    <div class="clock-date" id="clockDate"></div>
  </div>

</div>

<div class="home-grid">
  <!-- 左侧：技能和当前状态 -->
  <div class="home-sidebar">
    <!-- 技能栈 -->
    <div class="home-card">
      <h3>💻 技能栈</h3>
      {% for skill in site.data.profile.skills %}
      <div class="skill-category">
        <strong>{{ skill.name }}:</strong>
        <div class="skill-tags">
          {% for item in skill.items %}
          <span class="skill-tag">{{ item }}</span>
          {% endfor %}
        </div>
      </div>
      {% endfor %}
    </div>

    <!-- 当前在做 -->
    <div class="home-card">
      <h3>🚀 当前在做</h3>
      <ul class="currently-list">
        {% for item in site.data.profile.currently %}
        <li>{{ item }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>

  <!-- 右侧：项目和最近更新 -->
  <div class="home-main">
    <!-- 精选项目 -->
    <div class="home-card">
      <h3>⭐ 精选项目</h3>
      <div class="projects-grid">
        {% for project in site.data.projects %}
        {% if project.star %}
        <div class="project-card">
          <div class="project-header">
            <h4><a href="{{ project.url }}" target="_blank">{{ project.name }}</a></h4>
          </div>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-tags">
            {% for tag in project.tags %}
            <span class="project-tag">{{ tag }}</span>
            {% endfor %}
          </div>
        </div>
        {% endif %}
        {% endfor %}
      </div>
      <a href="#all-projects" class="view-all-link" onclick="document.getElementById('all-projects').scrollIntoView({behavior: 'smooth'}); return false;">查看所有项目 →</a>
    </div>

    <!-- 最近更新 -->
    <div class="home-card">
      <h3>📝 最近更新</h3>
      <ul class="recent-docs">
        {% assign sorted_docs = site.docs | sort: 'date' | reverse %}
        {% for doc in sorted_docs limit:3 %}
        <li>
          <a href="{{ doc.url }}">{{ doc.title }}</a>
          <span class="doc-date">{{ doc.date | date: "%Y-%m-%d" }}</span>
        </li>
        {% endfor %}
      </ul>
      <a href="/docs.html" class="view-all-link">查看知识库 →</a>
    </div>

    <!-- 所有项目 -->
    <div class="home-card" id="all-projects">
      <h3>📦 所有项目</h3>
      <div class="projects-list">
        {% for project in site.data.projects %}
        <div class="project-item">
          <div class="project-item-header">
            <h4><a href="{{ project.url }}" target="_blank">{{ project.name }}</a></h4>
            {% if project.star %}<span class="star-badge">⭐</span>{% endif %}
          </div>
          <p class="project-item-desc">{{ project.description }}</p>
          <div class="project-tags">
            {% for tag in project.tags %}
            <span class="project-tag">{{ tag }}</span>
            {% endfor %}
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
  </div>
</div>
