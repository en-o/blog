const API_BASE = 'http://localhost:3001/api';

// Tab 切换
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    // 切换 tab active 状态
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // 切换内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // 加载对应数据
    if (tabName === 'pages') loadPages();
    if (tabName === 'docs') loadDocs();
    if (tabName === 'data') loadDataManagement();
    if (tabName === 'git') loadGitStatus();
  });
});

// ============= 页面管理 =============

// 加载页面列表
async function loadPages() {
  try {
    const res = await fetch(`${API_BASE}/pages`);
    const { data } = await res.json();

    const html = data.map(page => `
      <div class="list-item">
        <div>
          <div class="list-item-title">${page.title}</div>
          <div class="list-item-meta">${page.path} → ${page.permalink}</div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-sm btn-primary" onclick="editPage('${page.path}')">编辑</button>
          <button class="btn btn-sm btn-danger" onclick="deletePage('${page.path}')">删除</button>
        </div>
      </div>
    `).join('');

    document.getElementById('pagesList').innerHTML = html || '<p>暂无页面</p>';
  } catch (error) {
    showAlert('error', '加载页面列表失败: ' + error.message);
  }
}

// 编辑页面
async function editPage(path) {
  try {
    const res = await fetch(`${API_BASE}/pages/${path}`);
    const { data } = await res.json();

    document.getElementById('pagePath').value = data.path;
    document.getElementById('pageTitle').value = data.frontMatter.title || '';
    document.getElementById('pagePermalink').value = data.frontMatter.permalink || '';
    document.getElementById('pageLayout').value = data.frontMatter.layout || 'page';
    document.getElementById('pageContent').value = data.content || '';

    // 滚动到表单
    document.getElementById('pageForm').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showAlert('error', '加载页面失败: ' + error.message);
  }
}

// 删除页面
async function deletePage(path) {
  if (!confirm('确定要删除这个页面吗？')) return;

  try {
    const res = await fetch(`${API_BASE}/pages/${path}`, { method: 'DELETE' });
    const result = await res.json();

    if (result.success) {
      showAlert('success', '页面删除成功');
      loadPages();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '删除失败: ' + error.message);
  }
}

// 重置页面表单
function resetPageForm() {
  document.getElementById('pageForm').reset();
}

// 提交页面表单
document.getElementById('pageForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const path = document.getElementById('pagePath').value;
  const frontMatter = {
    layout: document.getElementById('pageLayout').value,
    title: document.getElementById('pageTitle').value,
    permalink: document.getElementById('pagePermalink').value
  };
  const content = document.getElementById('pageContent').value;

  try {
    // 检查是否已存在（更新 vs 创建）
    const checkRes = await fetch(`${API_BASE}/pages/${path}`);
    const isUpdate = checkRes.ok;

    const res = await fetch(
      `${API_BASE}/pages${isUpdate ? '/' + path : ''}`,
      {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, frontMatter, content })
      }
    );

    const result = await res.json();

    if (result.success) {
      showAlert('success', isUpdate ? '页面更新成功' : '页面创建成功');
      resetPageForm();
      loadPages();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '操作失败: ' + error.message);
  }
});

// ============= 文档管理 =============

// 加载文档列表
async function loadDocs() {
  try {
    const res = await fetch(`${API_BASE}/docs`);
    const { data } = await res.json();

    // 按分类分组
    const byCategory = data.reduce((acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    }, {});

    const html = Object.entries(byCategory).map(([category, docs]) => `
      <h3 style="margin-top: 20px; color: #667eea;">${category}</h3>
      ${docs.map(doc => `
        <div class="list-item">
          <div>
            <div class="list-item-title">${doc.title}</div>
            <div class="list-item-meta">${doc.filename} | ${doc.date} | ${(doc.tags || []).join(', ')}</div>
          </div>
          <div class="list-item-actions">
            <button class="btn btn-sm btn-primary" onclick="editDoc('${doc.category}', '${doc.filename}')">编辑</button>
            <button class="btn btn-sm btn-danger" onclick="deleteDoc('${doc.category}', '${doc.filename}')">删除</button>
          </div>
        </div>
      `).join('')}
    `).join('');

    document.getElementById('docsList').innerHTML = html || '<p>暂无文档</p>';

    // 加载分类列表
    const categoriesRes = await fetch(`${API_BASE}/docs/categories`);
    const { data: categories } = await categoriesRes.json();
    document.getElementById('categoryList').innerHTML = categories.map(c => `<option value="${c}">`).join('');
  } catch (error) {
    showAlert('error', '加载文档列表失败: ' + error.message);
  }
}

// 编辑文档
async function editDoc(category, filename) {
  try {
    const res = await fetch(`${API_BASE}/docs/${category}/${filename}`);
    const { data } = await res.json();

    document.getElementById('docCategory').value = data.category;
    document.getElementById('docFilename').value = data.filename;
    document.getElementById('docTitle').value = data.frontMatter.title || '';
    document.getElementById('docDate').value = data.frontMatter.date || new Date().toISOString().split('T')[0];
    document.getElementById('docTags').value = (data.frontMatter.tags || []).join(', ');
    document.getElementById('docContent').value = data.content || '';

    document.getElementById('docForm').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showAlert('error', '加载文档失败: ' + error.message);
  }
}

// 删除文档
async function deleteDoc(category, filename) {
  if (!confirm('确定要删除这个文档吗？')) return;

  try {
    const res = await fetch(`${API_BASE}/docs/${category}/${filename}`, { method: 'DELETE' });
    const result = await res.json();

    if (result.success) {
      showAlert('success', '文档删除成功');
      loadDocs();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '删除失败: ' + error.message);
  }
}

// 重置文档表单
function resetDocForm() {
  document.getElementById('docForm').reset();
  document.getElementById('docDate').value = new Date().toISOString().split('T')[0];
}

// 提交文档表单
document.getElementById('docForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = document.getElementById('docCategory').value;
  const filename = document.getElementById('docFilename').value;
  const frontMatter = {
    layout: 'doc',
    title: document.getElementById('docTitle').value,
    category: category,
    date: document.getElementById('docDate').value,
    tags: document.getElementById('docTags').value.split(',').map(t => t.trim()).filter(Boolean)
  };
  const content = document.getElementById('docContent').value;

  try {
    // 检查是否已存在
    const checkRes = await fetch(`${API_BASE}/docs/${category}/${filename}`);
    const isUpdate = checkRes.ok;

    const res = await fetch(
      `${API_BASE}/docs${isUpdate ? '/' + category + '/' + filename : ''}`,
      {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, filename, frontMatter, content })
      }
    );

    const result = await res.json();

    if (result.success) {
      showAlert('success', isUpdate ? '文档更新成功' : '文档创建成功');
      resetDocForm();
      loadDocs();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '操作失败: ' + error.message);
  }
});

// ============= 数据管理 =============

async function loadDataManagement() {
  await loadLinks();
  await loadThoughts();
}

// 加载友链
async function loadLinks() {
  try {
    const res = await fetch(`${API_BASE}/data/links`);
    const { data } = await res.json();

    const html = `
      <div id="linksEditor">
        <textarea id="linksData" style="width:100%; min-height:300px; font-family: monospace;">${JSON.stringify(data, null, 2)}</textarea>
        <br><br>
        <button class="btn btn-primary" onclick="saveLinks()">保存友链</button>
        <small style="display:block; margin-top:10px; color:#999;">编辑 JSON 格式的友链数据</small>
      </div>
    `;

    document.getElementById('linksManagement').innerHTML = html;
  } catch (error) {
    showAlert('error', '加载友链失败: ' + error.message);
  }
}

// 保存友链
async function saveLinks() {
  try {
    const data = JSON.parse(document.getElementById('linksData').value);

    const res = await fetch(`${API_BASE}/data/links`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '友链保存成功');
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', 'JSON 格式错误或保存失败: ' + error.message);
  }
}

// 加载碎碎念
async function loadThoughts() {
  try {
    const res = await fetch(`${API_BASE}/data/thoughts`);
    const { data } = await res.json();

    const html = `
      <div id="thoughtsEditor">
        <textarea id="thoughtsData" style="width:100%; min-height:300px; font-family: monospace;">${JSON.stringify(data, null, 2)}</textarea>
        <br><br>
        <button class="btn btn-primary" onclick="saveThoughts()">保存碎碎念</button>
        <small style="display:block; margin-top:10px; color:#999;">编辑 JSON 格式的碎碎念数据</small>
      </div>
    `;

    document.getElementById('thoughtsManagement').innerHTML = html;
  } catch (error) {
    showAlert('error', '加载碎碎念失败: ' + error.message);
  }
}

// 保存碎碎念
async function saveThoughts() {
  try {
    const data = JSON.parse(document.getElementById('thoughtsData').value);

    const res = await fetch(`${API_BASE}/data/thoughts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '碎碎念保存成功');
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', 'JSON 格式错误或保存失败: ' + error.message);
  }
}

// ============= Git 操作 =============

// 加载 Git 状态
async function loadGitStatus() {
  try {
    const res = await fetch(`${API_BASE}/git/status`);
    const { data } = await res.json();

    const html = `
      <div class="git-section">
        <div class="status-box">
          <h3>已修改 (${data.modified.length})</h3>
          ${data.modified.map(f => `<div class="status-item">M ${f}</div>`).join('') || '<div class="status-item">无</div>'}
        </div>
        <div class="status-box">
          <h3>已删除 (${data.deleted.length})</h3>
          ${data.deleted.map(f => `<div class="status-item">D ${f}</div>`).join('') || '<div class="status-item">无</div>'}
        </div>
        <div class="status-box">
          <h3>新增 (${data.not_added.length})</h3>
          ${data.not_added.map(f => `<div class="status-item">A ${f}</div>`).join('') || '<div class="status-item">无</div>'}
        </div>
        <div class="status-box">
          <h3>已暂存 (${data.staged.length})</h3>
          ${data.staged.map(f => `<div class="status-item">S ${f}</div>`).join('') || '<div class="status-item">无</div>'}
        </div>
      </div>
    `;

    document.getElementById('gitStatus').innerHTML = html;

    // 加载提交记录
    await loadGitLog();
  } catch (error) {
    document.getElementById('gitStatus').innerHTML = `<p style="color:red;">加载失败: ${error.message}</p>`;
  }
}

// 加载提交记录
async function loadGitLog() {
  try {
    const res = await fetch(`${API_BASE}/git/log`);
    const { data } = await res.json();

    const html = data.all.map(commit => `
      <div class="list-item">
        <div>
          <div class="list-item-title">${commit.message}</div>
          <div class="list-item-meta">${commit.author_name} · ${new Date(commit.date).toLocaleString()}</div>
        </div>
        <div><code style="font-size:12px;">${commit.hash.substring(0, 7)}</code></div>
      </div>
    `).join('');

    document.getElementById('gitLog').innerHTML = html || '<p>暂无提交记录</p>';
  } catch (error) {
    document.getElementById('gitLog').innerHTML = `<p style="color:red;">加载失败: ${error.message}</p>`;
  }
}

// 提交并推送
document.getElementById('gitForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = document.getElementById('commitMessage').value;
  const branch = document.getElementById('gitBranch').value || 'main';

  if (!confirm(`确定要提交并推送到 ${branch} 分支吗？`)) return;

  try {
    const res = await fetch(`${API_BASE}/git/commit-and-push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, branch })
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '提交并推送成功！');
      document.getElementById('commitMessage').value = '';
      loadGitStatus();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '操作失败: ' + error.message);
  }
});

// ============= 工具函数 =============

function showAlert(type, message) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  document.querySelector('.container').insertBefore(alert, document.querySelector('.tabs'));

  setTimeout(() => alert.remove(), 5000);
}

// 初始化
document.getElementById('docDate').value = new Date().toISOString().split('T')[0];
loadPages();
