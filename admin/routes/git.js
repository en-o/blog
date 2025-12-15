const express = require('express');
const router = express.Router();
const simpleGit = require('simple-git');
const path = require('path');

const REPO_DIR = path.join(__dirname, '../..');
const git = simpleGit(REPO_DIR);

// 获取 Git 状态
router.get('/status', async (req, res) => {
  try {
    const status = await git.status();
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 提交更改
router.post('/commit', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: '请提供提交信息' });
    }

    // 添加所有更改
    await git.add('./*');

    // 提交
    const result = await git.commit(message);

    res.json({
      success: true,
      message: '提交成功',
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 推送到远程仓库
router.post('/push', async (req, res) => {
  try {
    const { branch = 'main' } = req.body;

    const result = await git.push('origin', branch);

    res.json({
      success: true,
      message: '推送成功',
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 一键提交并推送
router.post('/commit-and-push', async (req, res) => {
  try {
    const { message, branch = 'main' } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: '请提供提交信息' });
    }

    // 添加所有更改
    await git.add('./*');

    // 提交
    await git.commit(message);

    // 推送
    await git.push('origin', branch);

    res.json({
      success: true,
      message: '提交并推送成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取最近的提交记录
router.get('/log', async (req, res) => {
  try {
    const { maxCount = 10 } = req.query;
    const log = await git.log({ maxCount: parseInt(maxCount) });
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
