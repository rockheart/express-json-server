# Express json server

基于Express的静态json数据服务

## 目录

<details>

* [概览](#Overview)
* [安装](#Install)
* [使用](#Useage)
* [License](#License)

</details>

## Overview

概览

基于express和json-server组合起来并制定了一些规则从而更好更快的嵌入应用中使用

## Install

安装

```bash
$ npm i [-S] express-json-server
```

## Useage

使用

```js
// app.js
const path = require('path');

const express = require('express');
const autoController = require('express-json-server');

const app = express();

// 配置db路径
app.autoController(path.join(__dirname, 'db'));

// 另一种运行方式
// autoController(app, path.join(__dirname, 'db'));

app.listen(3000);
```

## License

MIT - [xiewulong](https://github.com/xiewulong)
