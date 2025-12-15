# 我的blog
[![Language](https://img.shields.io/badge/Jekyll-Theme-blue)](https://github.com/en-o/yuque)
[![license](https://img.shields.io/github/license/TMaize/tmaize-blog)](https://github.com/en-o/yuque)
[![GitHub stars](https://img.shields.io/github/stars/en-o/yuque?style=social)](https://github.com/en-o/yuque)


# visit site
http://doc.tannn.cn/

# quick start  

1. 安装依赖`bundle install`
   
- Windows 环境下安装 Jekyll,访问 https://rubyinstaller.org/downloads/ 下载 Ruby+Devkit 版本（推荐 Ruby+Devkit 3.2.X (x64)） 
- 安装过程中的选择
  - 勾选 "Add Ruby executables to your PATH"
  - 安装完成后会弹出命令行窗口，输入 3 安装 MSYS2 和开发工具链
- 验证安装
  - ruby -v
  - gem -v
- 安装 Bundler
  - gem install bundler
- 安装项目依赖
  - cd C:\work\tan\code\blog && bundle install
-  运行 Jekyll
  -  bundle exec jekyll serve

2. 本地预览`bundle exec jekyll serve`
   > 然后访问 http://localhost:4000

3. 自定义内容
- 修改个人信息: 编辑 _config.yml 和 index.md
- 添加友链: 编辑 _data/links.yml
- 添加碎碎念: 编辑 _data/thoughts.yml
- 添加文档: 在 _docs/ 对应分类下创建 Markdown 文件

# 🎯 可视化管理平台

本项目提供了一个功能强大的可视化管理平台，让您无需手动编辑文件即可管理博客内容。

## 快速启动管理平台

```bash
# 1. 进入管理平台目录
cd admin

# 2. 安装依赖（首次使用）
npm install

# 3. 启动管理平台
npm start
```

访问：http://localhost:3001

## 管理平台功能

- **页面管理** - 可视化新增、编辑、删除页面
- **文档管理** - 管理知识库文档，支持分类
- **数据管理** - 管理友链和碎碎念数据
- **Git 集成** - 查看状态、提交更改、推送到 GitHub

详细使用说明请查看：[admin/README.md](admin/README.md)

**注意：** 管理平台仅用于本地使用，不会被发布到 GitHub Pages。

---

# 项目结构

```
blog/
├── pages/              # 📁 页面文件目录
│   ├── links.md       # 友链页面
│   ├── docs.md        # 知识库页面
│   └── thoughts.md    # 碎碎念页面
├── _layouts/          # 布局模板
│   ├── default.html   # 默认布局
│   ├── page.html      # 页面布局
│   └── doc.html       # 文档布局
├── _includes/         # 可复用组件
│   ├── header.html    # 头部导航
│   └── footer.html    # 页脚
├── _data/             # 数据文件
│   ├── links.yml      # 友链数据
│   └── thoughts.yml   # 碎碎念数据
├── _docs/             # 知识库文档集合
│   ├── frontend/      # 前端开发文档
│   ├── backend/       # 后端开发文档
│   └── devops/        # DevOps 文档
├── assets/            # 静态资源
│   └── css/
│       └── style.css  # 样式文件
├── index.md           # 首页
├── 404.md             # 404 页面
├── _config.yml        # Jekyll 配置
└── README.md          # 项目说明
```

# 页面管理

## 1. 新增页面

### 方法一：在 pages 目录下创建单个页面

在 `pages/` 目录下创建新的 Markdown 文件：

```bash
# 创建新页面
touch pages/about.md
```

编辑 `pages/about.md`：

```markdown
---
layout: page
title: 关于
permalink: /about.html
---

# 关于我

这里是关于页面的内容...
```

**重要参数说明：**
- `layout: page` - 使用页面布局模板
- `title: 关于` - 页面标题
- `permalink: /about.html` - 自定义 URL（必需，确保访问路径正确）

### 方法二：使用子目录组织页面

`pages/` 目录支持创建子目录来组织相关页面：

```bash
# 创建项目相关页面子目录
mkdir -p pages/projects

# 创建项目列表页
touch pages/projects/index.md

# 创建具体项目页面
touch pages/projects/project-a.md
touch pages/projects/project-b.md
```

示例 `pages/projects/index.md`：

```markdown
---
layout: page
title: 我的项目
permalink: /projects/
---

# 项目列表

- [项目 A](/projects/project-a.html)
- [项目 B](/projects/project-b.html)
```

示例 `pages/projects/project-a.md`：

```markdown
---
layout: page
title: 项目 A
permalink: /projects/project-a.html
---

# 项目 A

项目详细介绍...
```

## 2. 修改现有页面

直接编辑 `pages/` 目录下对应的 Markdown 文件：

```bash
# 修改友链页面
vim pages/links.md

# 修改知识库页面
vim pages/docs.md

# 修改碎碎念页面
vim pages/thoughts.md
```

## 3. 添加页面到导航栏

编辑 `_includes/header.html` 文件，在导航菜单中添加链接：

```html
<ul class="nav-menu">
  <li><a href="/">首页</a></li>
  <li><a href="/docs.html">知识库</a></li>
  <li><a href="/thoughts.html">碎碎念</a></li>
  <li><a href="/links.html">友链</a></li>
  <li><a href="/about.html">关于</a></li>  <!-- 新增 -->
</ul>
```

## 4. 添加知识库文档

在 `_docs/` 目录下按分类创建文档：

```bash
# 创建新分类目录
mkdir -p _docs/database

# 创建文档
touch _docs/database/mysql-optimization.md
```

编辑文档内容：

```markdown
---
layout: doc
title: MySQL 性能优化
category: 数据库
date: 2024-12-15
tags: [MySQL, 数据库, 性能优化]
---

# MySQL 性能优化

## 1. 索引优化

内容...

## 2. 查询优化

内容...
```

**文档参数说明：**
- `layout: doc` - 使用文档布局模板
- `title` - 文档标题
- `category` - 分类名称（会在知识库页面按分类分组显示）
- `date` - 发布/更新日期
- `tags` - 标签数组

## 5. 数据驱动的内容

### 添加友链

编辑 `_data/links.yml`：

```yaml
- name: 新朋友的博客
  url: https://friend.com
  description: 一句话介绍
  avatar: https://example.com/avatar.jpg
```

### 添加碎碎念

编辑 `_data/thoughts.yml`：

```yaml
- date: 2024-12-15
  content: 今天的想法和感悟...
  tags: [生活, 思考]
```

## 6. 使用不同的布局

项目提供了 3 种布局模板：

### default.html - 默认布局
包含页眉页脚的基础布局，适用于所有页面。

### page.html - 页面布局
继承自 default.html，添加了内容区域样式，适用于普通页面。

### doc.html - 文档布局
专为知识库文档设计，包含标题、日期、分类、标签等元数据展示。

**自定义布局示例：**

如果需要创建特殊布局，在 `_layouts/` 目录创建新文件：

```html
<!-- _layouts/custom.html -->
---
layout: default
---

<div class="custom-layout">
  <div class="sidebar">
    <!-- 侧边栏内容 -->
  </div>
  <div class="main-content">
    {{ content }}
  </div>
</div>
```

然后在页面中使用：

```markdown
---
layout: custom
title: 自定义页面
---

页面内容...
```

# 部署到 GitHub Pages

git add .
git commit -m "完成 Jekyll 个人主页搭建"
git push origin main

项目已经包含了：
- 响应式设计
- 完整的样式文件
- 4个核心页面（首页、知识库、碎碎念、友链）
- 4篇示例文档
- 数据驱动的友链和碎碎念功能



# 项目配置

1. 如果使用自己的域名，`CNAME`文件里的内容请换成你自己的域名，然后 CNAME 解析到`用户名.github.com`

2. 如果使用 GitHub 的的域名，请删除`CNAME`文件，然后把你的项目修改为`用户名.github.io`

3. 修改`_config.yml`文件，具体作用请参考注释

4. 网站的 logo 和 favicon 放在了`static/img/`下，替换即可，大小无所谓，图片比例最好是 1:1

5. 如果你是把项目 fork 过去的，想要删除我的提交记录可以使用下面的命令
   ```
   git checkout --orphan temp
   git add . && git commit -m init
   git branch -D master
   git branch -m temp master
   git push --force
   ```

