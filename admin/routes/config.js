const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

const ROOT_DIR = path.resolve(__dirname, '../../');
const CONFIG_FILE = path.join(ROOT_DIR, '_config.yml');
const FAVICON_PATH = path.join(ROOT_DIR, 'assets/images/favicon.ico');
const AVATAR_PATH = path.join(ROOT_DIR, 'assets/images/avatar.jpg');

// 获取配置信息
router.get('/info', async (req, res) => {
  try {
    const configContent = await fs.readFile(CONFIG_FILE, 'utf8');
    const config = yaml.load(configContent);

    // 检查文件是否存在
    const faviconExists = await fs.access(FAVICON_PATH).then(() => true).catch(() => false);
    const avatarExists = await fs.access(AVATAR_PATH).then(() => true).catch(() => false);

    res.json({
      success: true,
      data: {
        title: config.title || '',
        description: config.description || '',
        url: config.url || '',
        baseurl: config.baseurl || '',
        favicon: faviconExists ? '/assets/images/favicon.ico' : null,
        avatar: avatarExists ? '/assets/images/avatar.jpg' : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '读取配置失败: ' + error.message
    });
  }
});

// 更新配置信息
router.put('/info', async (req, res) => {
  try {
    const { title, description, url, baseurl } = req.body;

    // 读取现有配置
    const configContent = await fs.readFile(CONFIG_FILE, 'utf8');
    const config = yaml.load(configContent);

    // 更新配置项
    if (title !== undefined) config.title = title;
    if (description !== undefined) config.description = description;
    if (url !== undefined) config.url = url;
    if (baseurl !== undefined) config.baseurl = baseurl;

    // 写回文件
    const newConfigContent = yaml.dump(config, {
      lineWidth: -1,
      quotingType: '"'
    });

    await fs.writeFile(CONFIG_FILE, newConfigContent, 'utf8');

    res.json({
      success: true,
      message: '配置更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新配置失败: ' + error.message
    });
  }
});

// 上传图标/头像
router.post('/upload', async (req, res) => {
  try {
    const { type, data, filename } = req.body; // type: 'favicon' | 'avatar'

    if (!type || !data) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数'
      });
    }

    // 确保目录存在
    const imagesDir = path.join(ROOT_DIR, 'assets/images');
    await fs.mkdir(imagesDir, { recursive: true });

    // 解析base64数据
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        error: '无效的图片数据'
      });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');

    // 确定文件路径
    let targetPath;
    if (type === 'favicon') {
      targetPath = FAVICON_PATH;
    } else if (type === 'avatar') {
      targetPath = AVATAR_PATH;
    } else {
      return res.status(400).json({
        success: false,
        error: '无效的上传类型'
      });
    }

    // 写入文件
    await fs.writeFile(targetPath, imageBuffer);

    res.json({
      success: true,
      message: '上传成功',
      path: type === 'favicon' ? '/assets/images/favicon.ico' : '/assets/images/avatar.jpg'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '上传失败: ' + error.message
    });
  }
});

module.exports = router;
