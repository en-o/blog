---
layout: doc
title: Node.js 性能优化指南
category: 后端开发
date: 2024-11-28
tags: [Node.js, 性能优化]
---

# Node.js 性能优化指南

Node.js 应用的性能优化是一个系统工程，本文总结了一些常见的优化策略。

## 1. 异步编程

充分利用 Node.js 的异步特性，避免阻塞事件循环。

```javascript
// 不好的做法 - 同步读取文件
const data = fs.readFileSync('/file.txt');

// 好的做法 - 异步读取文件
fs.readFile('/file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 更好的做法 - 使用 Promise
const data = await fs.promises.readFile('/file.txt');
```

## 2. 使用流（Streams）

对于大文件处理，使用流可以显著降低内存占用。

```javascript
const fs = require('fs');

// 使用流读取大文件
const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);
```

## 3. 缓存策略

合理使用缓存可以大幅提升性能。

```javascript
const cache = new Map();

async function getData(key) {
  // 检查缓存
  if (cache.has(key)) {
    return cache.get(key);
  }

  // 从数据库获取
  const data = await db.query(key);

  // 存入缓存
  cache.set(key, data);

  return data;
}
```

## 4. 数据库优化

- 使用连接池
- 添加适当的索引
- 避免 N+1 查询问题
- 使用批量操作

```javascript
// 使用连接池
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});
```

## 5. 集群模式

利用多核 CPU，使用集群模式运行多个进程。

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Workers can share any TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World\n');
  }).listen(8000);
}
```

## 6. 使用压缩

启用 gzip 压缩可以减少传输数据量。

```javascript
const compression = require('compression');
const express = require('express');
const app = express();

app.use(compression());
```

## 7. 监控和分析

使用性能监控工具：
- New Relic
- AppDynamics
- Clinic.js
- Node.js 内置的 `--inspect` 标志

```bash
# 使用 Clinic.js 进行性能分析
clinic doctor -- node app.js
```

## 8. 避免内存泄漏

常见的内存泄漏原因：
- 全局变量
- 未清理的定时器
- 事件监听器未移除
- 闭包引用

```javascript
// 及时清理定时器
const timer = setInterval(() => {
  // do something
}, 1000);

// 使用完后清理
clearInterval(timer);
```

## 总结

性能优化是持续的过程，需要：
1. 定期进行性能测试
2. 监控生产环境指标
3. 根据瓶颈针对性优化
4. 保持代码简洁和可维护性
