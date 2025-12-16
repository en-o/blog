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
    if (tabName === 'home') loadHomeData();
    if (tabName === 'pages') loadPages();
    if (tabName === 'docs') loadDocs();
    if (tabName === 'data') loadDataManagement();
    if (tabName === 'config') loadConfig();
    if (tabName === 'git') loadGitStatus();
  });
});

// ============= 首页管理 =============

let profileData = {};
let projectsData = [];
let editingProjectIndex = -1;

async function loadHomeData() {
  await loadProfile();
  await loadProjects();
}

// 加载个人信息
async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/home/profile`);
    const { data } = await res.json();
    profileData = data;

    // 填充表单
    document.getElementById('profileName').value = data.name || '';
    document.getElementById('profileBio').value = data.bio || '';
    document.getElementById('profileIntro').value = data.intro || '';
    document.getElementById('profileGithub').value = data.social?.github || '';
    document.getElementById('profileEmail').value = data.social?.email || '';

    // 渲染技能栈
    renderSkillsList(data.skills || []);

    // 渲染当前在做
    renderCurrentlyList(data.currently || []);
  } catch (error) {
    showAlert('error', '加载个人信息失败: ' + error.message);
  }
}

// 渲染技能栈列表
function renderSkillsList(skills) {
  const html = skills.map((skill, index) => `
    <div class="list-item">
      <div>
        <div class="list-item-title">${skill.name}</div>
        <div class="list-item-meta">${skill.items.join(', ')}</div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-sm btn-primary" onclick="editSkill(${index})">编辑</button>
        <button class="btn btn-sm btn-danger" onclick="deleteSkill(${index})">删除</button>
      </div>
    </div>
  `).join('');

  document.getElementById('skillsList').innerHTML = html || '<p style="color:#999;">暂无技能栈</p>';
}

// 添加技能分类
function addSkill() {
  showSkillModal(null, (skillData) => {
    profileData.skills = profileData.skills || [];
    profileData.skills.push(skillData);
    saveProfile();
  });
}

// 编辑技能
function editSkill(index) {
  const skill = profileData.skills[index];
  showSkillModal(skill, (skillData) => {
    profileData.skills[index] = skillData;
    saveProfile();
  });
}

// 删除技能
function deleteSkill(index) {
  if (!confirm('确定要删除这个技能分类吗？')) return;
  profileData.skills.splice(index, 1);
  saveProfile();
}

// 渲染当前在做列表
function renderCurrentlyList(currently) {
  const html = currently.map((item, index) => `
    <div class="list-item">
      <div>
        <div class="list-item-title">${item}</div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-sm btn-primary" onclick="editCurrently(${index})">编辑</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCurrently(${index})">删除</button>
      </div>
    </div>
  `).join('');

  document.getElementById('currentlyList').innerHTML = html || '<p style="color:#999;">暂无内容</p>';
}

// 添加当前在做
function addCurrently() {
  showCurrentlyModal(null, (item) => {
    profileData.currently = profileData.currently || [];
    profileData.currently.push(item);
    saveProfile();
  });
}

// 编辑当前在做
function editCurrently(index) {
  const item = profileData.currently[index];
  showCurrentlyModal(item, (newItem) => {
    profileData.currently[index] = newItem;
    saveProfile();
  });
}

// 删除当前在做
function deleteCurrently(index) {
  if (!confirm('确定要删除这一项吗？')) return;
  profileData.currently.splice(index, 1);
  saveProfile();
}

// 保存个人信息
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  profileData.name = document.getElementById('profileName').value;
  profileData.bio = document.getElementById('profileBio').value;
  profileData.intro = document.getElementById('profileIntro').value;
  profileData.social = profileData.social || {};
  profileData.social.github = document.getElementById('profileGithub').value;
  profileData.social.email = document.getElementById('profileEmail').value;

  await saveProfile();
});

async function saveProfile() {
  try {
    const res = await fetch(`${API_BASE}/home/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '个人信息保存成功');
      renderSkillsList(profileData.skills || []);
      renderCurrentlyList(profileData.currently || []);
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '保存失败: ' + error.message);
  }
}

// 加载项目列表
async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/home/projects`);
    const { data } = await res.json();
    projectsData = data || [];
    renderProjectsList();
  } catch (error) {
    showAlert('error', '加载项目列表失败: ' + error.message);
  }
}

// 渲染项目列表
function renderProjectsList() {
  const html = projectsData.map((project, index) => `
    <div class="list-item">
      <div>
        <div class="list-item-title">
          ${project.name}
          ${project.star ? '<span class="star-badge">⭐</span>' : ''}
        </div>
        <div class="list-item-meta">${project.description}</div>
        <div class="list-item-meta">${project.url}</div>
        <div class="list-item-meta">${(project.tags || []).join(', ')}</div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-sm btn-primary" onclick="editProject(${index})">编辑</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProject(${index})">删除</button>
      </div>
    </div>
  `).join('');

  document.getElementById('projectsList').innerHTML = html || '<p style="color:#999;">暂无项目</p>';
}

// 编辑项目
function editProject(index) {
  const project = projectsData[index];
  document.getElementById('projectName').value = project.name || '';
  document.getElementById('projectDesc').value = project.description || '';
  document.getElementById('projectUrl').value = project.url || '';
  document.getElementById('projectTags').value = (project.tags || []).join(', ');
  document.getElementById('projectStar').checked = project.star || false;

  editingProjectIndex = index;

  const submitBtn = document.querySelector('#projectForm button[type="submit"]');
  submitBtn.textContent = '更新项目';
  submitBtn.className = 'btn btn-success';

  document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
}

// 删除项目
function deleteProject(index) {
  if (!confirm('确定要删除这个项目吗？')) return;
  projectsData.splice(index, 1);
  saveProjects();
}

// 重置项目表单
function resetProjectForm() {
  document.getElementById('projectForm').reset();
  editingProjectIndex = -1;

  const submitBtn = document.querySelector('#projectForm button[type="submit"]');
  submitBtn.textContent = '添加项目';
  submitBtn.className = 'btn btn-primary';
}

// 提交项目表单
document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const project = {
    name: document.getElementById('projectName').value,
    description: document.getElementById('projectDesc').value,
    url: document.getElementById('projectUrl').value,
    tags: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(Boolean),
    star: document.getElementById('projectStar').checked
  };

  if (editingProjectIndex >= 0) {
    projectsData[editingProjectIndex] = project;
  } else {
    projectsData.push(project);
  }

  await saveProjects();
  resetProjectForm();
});

async function saveProjects() {
  try {
    const res = await fetch(`${API_BASE}/home/projects`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectsData)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '项目列表保存成功');
      renderProjectsList();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '保存失败: ' + error.message);
  }
}

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
<!--        <div class="list-item-actions">-->
<!--          <button class="btn btn-sm btn-primary" onclick="editPage('${page.path}')">编辑</button>-->
<!--          <button class="btn btn-sm btn-danger" onclick="deletePage('${page.path}')">删除</button>-->
<!--        </div>-->
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

// 导入语雀文档
function importYuqueDoc() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.md';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await file.text();
      const parsed = parseYuqueMarkdown(content);

      // 检查是否正在编辑现有文档
      const isEditing = document.getElementById('docFilename').value.trim() !== '' &&
                        document.getElementById('docCategory').value.trim() !== '';

      if (isEditing) {
        // 编辑模式：只更新内容,保留其他字段
        document.getElementById('docContent').value = parsed.content;
        showAlert('success', '文档内容已更新！其他信息保持不变,请检查后保存。');
      } else {
        // 新建模式：填充所有字段
        const filename = file.name;
        document.getElementById('docFilename').value = filename;
        document.getElementById('docTitle').value = parsed.title || filename.replace('.md', '');
        document.getElementById('docContent').value = parsed.content;
        showAlert('success', '语雀文档导入成功！请补充分类、日期等信息后保存。');
      }

      document.getElementById('docForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      showAlert('error', '导入失败: ' + error.message);
    }
  };
  input.click();
}

// 解析语雀导出的 Markdown 文档 - 仅处理标题降级
function parseYuqueMarkdown(content) {
  let title = '';
  let processedContent = content;

  // 1. 提取标题（从第一个 h1 标签或第一个 # 标题）用于填充表单
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  if (h1Match) {
    const h1Content = h1Match[1];
    // 移除 font 标签获取纯文本
    title = h1Content.replace(/<font[^>]*>(.*?)<\/font>/g, '$1').trim();
  } else {
    // 如果没有HTML h1,尝试提取第一个Markdown标题
    const mdH1Match = content.match(/^#\s+(.+)$/m);
    if (mdH1Match) {
      title = mdH1Match[1].trim();
    }
  }

  // 2. 【智能标题降级】检测第一个标题级别，决定是否降级
  // 查找第一个标题（Markdown格式 # 开头）
  const firstMdHeading = processedContent.match(/^(#{1,6})\s/m);

  // 只有当第一个标题是 # (h1) 时才降级
  const shouldDemoteHeadings = firstMdHeading && firstMdHeading[1] === '#';

  // 3. 处理 Markdown 格式的标题降级（保持内容完全不变）
  if (shouldDemoteHeadings) {
    // 使用临时标记避免重复替换,保持标题内容完全不变
    processedContent = processedContent.replace(/^# (.*)$/gm, '{{H1}}$1');
    processedContent = processedContent.replace(/^## (.*)$/gm, '{{H2}}$1');
    processedContent = processedContent.replace(/^### (.*)$/gm, '{{H3}}$1');
    processedContent = processedContent.replace(/^#### (.*)$/gm, '{{H4}}$1');
    processedContent = processedContent.replace(/^##### (.*)$/gm, '{{H5}}$1');
    processedContent = processedContent.replace(/^###### (.*)$/gm, '{{H6}}$1');

    // 替换为降级后的标题（内容保持原样）
    processedContent = processedContent.replace(/^\{\{H1\}\}(.*)$/gm, '## $1');
    processedContent = processedContent.replace(/^\{\{H2\}\}(.*)$/gm, '### $1');
    processedContent = processedContent.replace(/^\{\{H3\}\}(.*)$/gm, '#### $1');
    processedContent = processedContent.replace(/^\{\{H4\}\}(.*)$/gm, '##### $1');
    processedContent = processedContent.replace(/^\{\{H5\}\}(.*)$/gm, '###### $1');
    processedContent = processedContent.replace(/^\{\{H6\}\}(.*)$/gm, '###### $1');
  }
  // 如果不需要降级，保持原标题级别和内容完全不变

  return {
    title,
    content: processedContent
  };
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

let linksData = [];
let thoughtsData = [];
let editingLinkIndex = -1;
let editingThoughtIndex = -1;

async function loadDataManagement() {
  await loadLinks();
  await loadThoughts();
}

// 友链管理
async function loadLinks() {
  try {
    const res = await fetch(`${API_BASE}/data/links`);
    const { data } = await res.json();
    linksData = data || [];
    renderLinksList();
  } catch (error) {
    showAlert('error', '加载友链失败: ' + error.message);
  }
}

function renderLinksList() {
  const html = linksData.map((link, index) => `
    <div class="list-item">
      <div>
        <div class="list-item-title">${link.name}</div>
        <div class="list-item-meta">${link.url}</div>
        <div class="list-item-meta">${link.description}</div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-sm btn-primary" onclick="editLink(${index})">编辑</button>
        <button class="btn btn-sm btn-danger" onclick="deleteLink(${index})">删除</button>
      </div>
    </div>
  `).join('');

  document.getElementById('linksList').innerHTML = html || '<p style="color:#999;">暂无友链</p>';
}

function editLink(index) {
  const link = linksData[index];
  document.getElementById('linkName').value = link.name || '';
  document.getElementById('linkUrl').value = link.url || '';
  document.getElementById('linkDesc').value = link.description || '';
  document.getElementById('linkAvatar').value = link.avatar || '';

  editingLinkIndex = index;

  // 修改按钮文本
  const submitBtn = document.querySelector('#linkForm button[type="submit"]');
  submitBtn.textContent = '更新友链';
  submitBtn.className = 'btn btn-success';

  document.getElementById('linkForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteLink(index) {
  if (!confirm('确定要删除这个友链吗？')) return;

  linksData.splice(index, 1);
  saveLinksData();
}

function resetLinkForm() {
  document.getElementById('linkForm').reset();
  editingLinkIndex = -1;

  const submitBtn = document.querySelector('#linkForm button[type="submit"]');
  submitBtn.textContent = '添加友链';
  submitBtn.className = 'btn btn-primary';
}

document.getElementById('linkForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const link = {
    name: document.getElementById('linkName').value,
    url: document.getElementById('linkUrl').value,
    description: document.getElementById('linkDesc').value,
    avatar: document.getElementById('linkAvatar').value || 'https://via.placeholder.com/60'
  };

  if (editingLinkIndex >= 0) {
    // 更新
    linksData[editingLinkIndex] = link;
  } else {
    // 添加
    linksData.push(link);
  }

  await saveLinksData();
  resetLinkForm();
});

async function saveLinksData() {
  try {
    const res = await fetch(`${API_BASE}/data/links`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linksData)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '友链保存成功');
      renderLinksList();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '保存失败: ' + error.message);
  }
}

// 碎碎念管理
async function loadThoughts() {
  try {
    const res = await fetch(`${API_BASE}/data/thoughts`);
    const { data } = await res.json();
    thoughtsData = data || [];
    renderThoughtsList();
  } catch (error) {
    showAlert('error', '加载碎碎念失败: ' + error.message);
  }
}

function renderThoughtsList() {
  // 按日期时间倒序排序（最新的在前）
  const sortedThoughts = thoughtsData.sort((a, b) => {
    const dateA = new Date(a.datetime || a.date);
    const dateB = new Date(b.datetime || b.date);
    return dateB - dateA;
  });

  const html = sortedThoughts.map((thought, index) => `
    <div class="list-item">
      <div>
        <div class="list-item-title">${thought.content}</div>
        <div class="list-item-meta">
          ${thought.datetime || thought.date}
          ${thought.tags ? ' | ' + thought.tags.join(', ') : ''}
        </div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-sm btn-primary" onclick="editThought(${index})">编辑</button>
        <button class="btn btn-sm btn-danger" onclick="deleteThought(${index})">删除</button>
      </div>
    </div>
  `).join('');

  document.getElementById('thoughtsList').innerHTML = html || '<p style="color:#999;">暂无碎碎念</p>';
}

function editThought(index) {
  const thought = thoughtsData[index];
  const datetime = thought.datetime || thought.date;

  // 转换为 datetime-local 格式 (YYYY-MM-DDTHH:mm)
  let datetimeValue;
  if (datetime.includes(' ')) {
    // 格式: "2025-12-15 14:30"
    datetimeValue = datetime.replace(' ', 'T');
  } else {
    // 格式: "2025-12-15"
    datetimeValue = datetime + 'T00:00';
  }

  document.getElementById('thoughtDatetime').value = datetimeValue;
  document.getElementById('thoughtContent').value = thought.content || '';
  document.getElementById('thoughtTags').value = (thought.tags || []).join(', ');

  editingThoughtIndex = index;

  // 修改按钮文本
  const submitBtn = document.querySelector('#thoughtForm button[type="submit"]');
  submitBtn.textContent = '更新碎碎念';
  submitBtn.className = 'btn btn-success';

  document.getElementById('thoughtForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteThought(index) {
  if (!confirm('确定要删除这条碎碎念吗？')) return;

  thoughtsData.splice(index, 1);
  saveThoughtsData();
}

function resetThoughtForm() {
  document.getElementById('thoughtForm').reset();

  // 设置为当前日期时间
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('thoughtDatetime').value = `${year}-${month}-${day}T${hours}:${minutes}`;

  editingThoughtIndex = -1;

  const submitBtn = document.querySelector('#thoughtForm button[type="submit"]');
  submitBtn.textContent = '添加碎碎念';
  submitBtn.className = 'btn btn-primary';
}

document.getElementById('thoughtForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // 将 datetime-local 格式 (YYYY-MM-DDTHH:mm) 转换为 YAML 格式 (YYYY-MM-DD HH:mm)
  const datetimeLocal = document.getElementById('thoughtDatetime').value;
  const datetime = datetimeLocal.replace('T', ' ');

  const thought = {
    datetime: datetime,
    content: document.getElementById('thoughtContent').value,
    tags: document.getElementById('thoughtTags').value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  };

  if (editingThoughtIndex >= 0) {
    // 更新
    thoughtsData[editingThoughtIndex] = thought;
  } else {
    // 添加到开头（最新的在前面）
    thoughtsData.unshift(thought);
  }

  await saveThoughtsData();
  resetThoughtForm();
});

async function saveThoughtsData() {
  try {
    const res = await fetch(`${API_BASE}/data/thoughts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thoughtsData)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '碎碎念保存成功');
      renderThoughtsList();
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '保存失败: ' + error.message);
  }
}

// ============= 配置管理 =============

// 加载配置信息
async function loadConfig() {
  try {
    const res = await fetch(`${API_BASE}/config/info`);
    const { data } = await res.json();

    document.getElementById('configTitle').value = data.title || '';
    document.getElementById('configDescription').value = data.description || '';
    document.getElementById('configUrl').value = data.url || '';
    document.getElementById('configBaseurl').value = data.baseurl || '';
    document.getElementById('configGithubUrl').value = data.github_url || '';

    // Footer配置
    document.getElementById('configFooterText').value = data.footer_text || '';
    document.getElementById('configFooterPoweredBy').checked = data.footer_powered_by !== false;
    document.getElementById('configFooterPoweredByText').value = data.footer_powered_by_text || 'Powered by';
    document.getElementById('configFooterPoweredByName').value = data.footer_powered_by_name || 'Jekyll';
    document.getElementById('configFooterPoweredByLink').value = data.footer_powered_by_link || 'https://jekyllrb.com/';

    // 显示图标预览
    if (data.favicon) {
      document.getElementById('faviconPreview').innerHTML = `
        <img src="${data.favicon}?t=${Date.now()}" style="width: 64px; height: 64px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" alt="Favicon">
      `;
    } else {
      document.getElementById('faviconPreview').innerHTML = '<p style="color: #999;">暂无图标</p>';
    }

    if (data.avatar) {
      document.getElementById('avatarPreview').innerHTML = `
        <img src="${data.avatar}?t=${Date.now()}" style="width: 120px; height: 120px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.1); object-fit: cover;" alt="Avatar">
      `;
    } else {
      document.getElementById('avatarPreview').innerHTML = '<p style="color: #999;">暂无头像</p>';
    }
  } catch (error) {
    showAlert('error', '加载配置失败: ' + error.message);
  }
}

// 保存配置
document.getElementById('configForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const config = {
    title: document.getElementById('configTitle').value,
    description: document.getElementById('configDescription').value,
    url: document.getElementById('configUrl').value,
    baseurl: document.getElementById('configBaseurl').value,
    github_url: document.getElementById('configGithubUrl').value,
    footer_text: document.getElementById('configFooterText').value,
    footer_powered_by: document.getElementById('configFooterPoweredBy').checked,
    footer_powered_by_text: document.getElementById('configFooterPoweredByText').value,
    footer_powered_by_name: document.getElementById('configFooterPoweredByName').value,
    footer_powered_by_link: document.getElementById('configFooterPoweredByLink').value
  };

  try {
    const res = await fetch(`${API_BASE}/config/info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', '配置保存成功');
    } else {
      showAlert('error', result.error);
    }
  } catch (error) {
    showAlert('error', '保存失败: ' + error.message);
  }
});

// 上传Favicon
async function uploadFavicon() {
  const input = document.getElementById('faviconInput');
  const file = input.files[0];

  if (!file) {
    showAlert('error', '请先选择图标文件');
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const res = await fetch(`${API_BASE}/config/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'favicon',
          data: e.target.result,
          filename: file.name
        })
      });

      const result = await res.json();

      if (result.success) {
        showAlert('success', '图标上传成功');
        loadConfig();
        input.value = '';
      } else {
        showAlert('error', result.error);
      }
    } catch (error) {
      showAlert('error', '上传失败: ' + error.message);
    }
  };

  reader.readAsDataURL(file);
}

// 上传Avatar
async function uploadAvatar() {
  const input = document.getElementById('avatarInput');
  const file = input.files[0];

  if (!file) {
    showAlert('error', '请先选择头像文件');
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const res = await fetch(`${API_BASE}/config/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'avatar',
          data: e.target.result,
          filename: file.name
        })
      });

      const result = await res.json();

      if (result.success) {
        showAlert('success', '头像上传成功');
        loadConfig();
        input.value = '';
      } else {
        showAlert('error', result.error);
      }
    } catch (error) {
      showAlert('error', '上传失败: ' + error.message);
    }
  };

  reader.readAsDataURL(file);
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

// 显示技能模态框
function showSkillModal(skill, onSave) {
  const isEdit = !!skill;
  const skillItems = skill?.items || [];

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${isEdit ? '编辑技能分类' : '添加技能分类'}</h3>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>分类名称 *</label>
          <input type="text" id="skillModalName" value="${skill?.name || ''}" placeholder="如：前端、后端、数据库">
        </div>
        <div class="form-group">
          <label>技能项目 *</label>
          <input type="text" id="skillModalItemInput" placeholder="输入技能名称后按回车添加">
          <div class="skill-items-input" id="skillItemsContainer"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal(this)">取消</button>
        <button class="btn btn-primary" id="saveSkillBtn">保存</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 渲染已有技能项
  const container = document.getElementById('skillItemsContainer');
  const renderItems = () => {
    container.innerHTML = skillItems.map((item, idx) => `
      <span class="skill-item-tag">
        ${item}
        <button onclick="removeSkillItem(${idx})">&times;</button>
      </span>
    `).join('');
  };
  renderItems();

  // 添加技能项
  const itemInput = document.getElementById('skillModalItemInput');
  itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = itemInput.value.trim();
      if (value) {
        skillItems.push(value);
        itemInput.value = '';
        renderItems();
      }
    }
  });

  // 移除技能项
  window.removeSkillItem = (idx) => {
    skillItems.splice(idx, 1);
    renderItems();
  };

  // 保存
  document.getElementById('saveSkillBtn').onclick = () => {
    const name = document.getElementById('skillModalName').value.trim();
    if (!name) {
      showAlert('error', '请输入分类名称');
      return;
    }
    if (skillItems.length === 0) {
      showAlert('error', '请至少添加一个技能项目');
      return;
    }
    onSave({ name, items: skillItems });
    closeModal(modal);
  };

  // 点击遮罩关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

// 显示当前在做模态框
function showCurrentlyModal(item, onSave) {
  const isEdit = !!item;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${isEdit ? '编辑项目' : '添加项目'}</h3>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>内容 *</label>
          <textarea id="currentlyModalContent" rows="3" placeholder="描述你正在做的事情...">${item || ''}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal(this)">取消</button>
        <button class="btn btn-primary" id="saveCurrentlyBtn">保存</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 保存
  document.getElementById('saveCurrentlyBtn').onclick = () => {
    const content = document.getElementById('currentlyModalContent').value.trim();
    if (!content) {
      showAlert('error', '请输入内容');
      return;
    }
    onSave(content);
    closeModal(modal);
  };

  // 点击遮罩关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // 聚焦到输入框
  setTimeout(() => document.getElementById('currentlyModalContent').focus(), 100);
}

// 关闭模态框
function closeModal(element) {
  const modal = element.closest ? element.closest('.modal-overlay') : element;
  if (modal) modal.remove();
}

// 初始化
document.getElementById('docDate').value = new Date().toISOString().split('T')[0];

// 设置碎碎念的初始日期时间
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
document.getElementById('thoughtDatetime').value = `${year}-${month}-${day}T${hours}:${minutes}`;

// 加载初始显示的标签页数据
const initialTab = document.querySelector('.tab.active');
if (initialTab) {
  const tabName = initialTab.dataset.tab;
  if (tabName === 'home') loadHomeData();
  else if (tabName === 'pages') loadPages();
  else if (tabName === 'docs') loadDocs();
  else if (tabName === 'data') loadDataManagement();
  else if (tabName === 'config') loadConfig();
  else if (tabName === 'git') loadGitStatus();
}
