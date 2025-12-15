---
layout: doc
title: React Hooks 详解
category: 前端开发
date: 2024-12-15
tags: [React, JavaScript]
---

# React Hooks 详解

React Hooks 是 React 16.8 引入的新特性，它让我们能够在函数组件中使用 state 和其他 React 特性。

## useState

`useState` 是最常用的 Hook，用于在函数组件中添加状态。

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点击我
      </button>
    </div>
  );
}
```

**要点：**
- 初始状态只在第一次渲染时使用
- setState 函数用于更新状态
- 可以传入函数来基于旧值计算新值

## useEffect

`useEffect` 用于处理副作用，如数据获取、订阅、手动修改 DOM 等。

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `你点击了 ${count} 次`;
  }, [count]); // 仅在 count 更改时更新

  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点击我
      </button>
    </div>
  );
}
```

**依赖数组：**
- 空数组 `[]`：仅在挂载时运行一次
- 无依赖数组：每次渲染都运行
- 包含值：仅在这些值改变时运行

## useContext

用于订阅 React Context，避免组件嵌套。

```jsx
const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>按钮</button>;
}
```

## 自定义 Hooks

自定义 Hooks 让你能够提取组件逻辑到可复用的函数中。

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```

## 最佳实践

1. 只在最顶层使用 Hooks
2. 只在 React 函数中调用 Hooks
3. 使用 ESLint 插件检查 Hooks 规则
4. 合理使用依赖数组避免不必要的渲染
5. 将相关逻辑封装到自定义 Hooks 中

## 总结

React Hooks 改变了我们编写 React 组件的方式，让函数组件拥有了类组件的能力，同时代码更简洁、逻辑更清晰。
