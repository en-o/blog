---
layout: page
title: 知识库
permalink: /docs.html
---

<h2>知识库</h2>

<div class="docs-wrapper">
  <!-- 左侧：分类导航 -->
  <aside class="docs-sidebar">
    <div class="docs-sidebar-sticky">
      <h3>分类</h3>
      <nav class="category-nav">
        <ul class="category-list">
          {% assign docs_by_category = site.docs | group_by: "category" %}
          {% for category in docs_by_category %}
          <li class="category-item {% if forloop.first %}active{% endif %}" data-category="{{ category.name }}">
            <a href="#" class="category-link">{{ category.name }}</a>
          </li>
          {% endfor %}
        </ul>
      </nav>
    </div>
  </aside>

  <!-- 右侧：文档列表 -->
  <div class="docs-content">
    <div id="docs-list-container">
      {% assign docs_by_category = site.docs | group_by: "category" %}
      {% assign first_category = docs_by_category.first %}

      <div class="docs-category-title" id="current-category-title">
        {{ first_category.name }}
      </div>

      <ul class="doc-list" id="doc-list">
        {% for doc in first_category.items %}
        <li>
          <a href="{{ doc.url }}">{{ doc.title }}</a>
          <span class="doc-meta">{{ doc.date | date: "%Y-%m-%d" }}</span>
        </li>
        {% endfor %}
      </ul>
    </div>
  </div>
</div>

<!-- 存储所有分类数据供JavaScript使用 -->
<script type="application/json" id="docs-data">
{
  {% for category in docs_by_category %}
  "{{ category.name }}": [
    {% for doc in category.items %}
    {
      "title": "{{ doc.title | escape }}",
      "url": "{{ doc.url }}",
      "date": "{{ doc.date | date: '%Y-%m-%d' }}"
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]{% unless forloop.last %},{% endunless %}
  {% endfor %}
}
</script>

<script>
  // 分类切换逻辑
  document.addEventListener('DOMContentLoaded', function() {
    const docsData = JSON.parse(document.getElementById('docs-data').textContent);
    const categoryItems = document.querySelectorAll('.category-item');
    const docList = document.getElementById('doc-list');
    const categoryTitle = document.getElementById('current-category-title');

    categoryItems.forEach(item => {
      const link = item.querySelector('.category-link');

      link.addEventListener('click', function(e) {
        e.preventDefault();
        const categoryName = item.dataset.category;

        // 更新激活状态
        categoryItems.forEach(ci => ci.classList.remove('active'));
        item.classList.add('active');

        // 更新标题
        categoryTitle.textContent = categoryName;

        // 更新文档列表
        const docs = docsData[categoryName] || [];
        let html = '';
        docs.forEach(doc => {
          html += `
            <li>
              <a href="${doc.url}">${doc.title}</a>
              <span class="doc-meta">${doc.date}</span>
            </li>
          `;
        });

        docList.innerHTML = html || '<li style="color: #999;">暂无文档</li>';
      });
    });
  });
</script>

