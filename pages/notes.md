---
layout: page
title: 手札
permalink: /notes.html
---

<div class="notes-page" id="notes-page">
  <div class="notes-header">
    <div class="notes-selector">
      <label for="notes-select">选择手札：</label>
      <select id="notes-select" class="notes-dropdown">
        {% for note in site.data.notes %}
        <option value="{{ note.url }}" {% if forloop.first %}selected{% endif %}>
          {{ note.icon }} {{ note.name }}
        </option>
        {% endfor %}
      </select>
    </div>
    <div class="notes-actions">
      <button id="notes-fullscreen-btn" class="notes-action-btn" title="最大化">
        <span class="fullscreen-icon" id="fullscreen-icon">⛶</span>
      </button>
      <a id="notes-external-link" href="{{ site.data.notes[0].url }}" target="_blank" class="notes-action-btn" title="在新窗口打开">
        ↗
      </a>
    </div>
  </div>

  <div class="notes-content" id="notes-content">
    <iframe
      id="notes-iframe"
      src="{{ site.data.notes[0].url }}"
      class="yuque-iframe"
      frameborder="0"
      allowfullscreen>
    </iframe>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var select = document.getElementById('notes-select');
  var iframe = document.getElementById('notes-iframe');
  var externalLink = document.getElementById('notes-external-link');
  var fullscreenBtn = document.getElementById('notes-fullscreen-btn');
  var fullscreenIcon = document.getElementById('fullscreen-icon');
  var notesPage = document.getElementById('notes-page');

  select.addEventListener('change', function() {
    var url = this.value;
    iframe.src = url;
    externalLink.href = url;
  });

  // 切换最大化
  fullscreenBtn.addEventListener('click', function() {
    notesPage.classList.toggle('notes-maximized');
    // 切换图标
    if (notesPage.classList.contains('notes-maximized')) {
      fullscreenIcon.textContent = '⛶';
      fullscreenIcon.style.transform = 'rotate(45deg)';
    } else {
      fullscreenIcon.textContent = '⛶';
      fullscreenIcon.style.transform = 'rotate(0deg)';
    }
  });
});
</script>
