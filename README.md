# Express json server

基于Express的静态json数据服务

## 目录

<details>

* [概览](#overview)
* [安装](#install)
* [使用](#useage)
* [配置](#configure)
* [范例](#sample)
* [License](#license)

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
const logger = require('morgan');
const express = require('express');
const jsonServer = require('express-json-server');

const app = express();

app.use(logger('dev'));

// 配置db路径
app.jsonServer(path.join(__dirname, 'db'));

// 另一种运行方式
// jsonServer(app, path.join(__dirname, 'db'));

app.listen(3000);
```

## Configure

配置

```js
// db/index.js
module.exports = {
  delay: 500,                 // 响应延迟(ms), 可选, 默认0
  // foreignKeySuffix: 'Id',  // 外键后缀, 可选, 默认'Id', 'userId'则外键关联user表的id,
  // id: 'id',                // 数据id, 可选, 默认'id'
  json: 'db.json',            // json数据存储到文件中, 可选, 默认直接返回js生成的动态数据
  // jsonSpaces: 2,           // json缩进空格数, 可选, 默认2
  // middlewares: [],         // 中间件列表, 可选
  // noCors: false,           // 禁止跨域访问, 可选, 默认false不禁止
  // noGzip: false,           // 禁止压缩传输, 可选, 默认false不禁止
  // readOnly: false,         // 只读模式, 可选, 默认false非只读
  // route: '/api',           // 挂载到express下的路由, 可选, 默认'/api', 则访问路径为'/api/${table}'

  // 路由别名, 可选
  routes: {
    '/good': '/product',
    '/member': '/user',
  },

  // 表数据, 必须
  tables: {
    product: require('./product'),
    user: require('./user'),
  },

};
```

## Sample

范例

```bash
$ node app.js

# curl -X GET localhost:3000/api/user -> GET /
[
  {
    "id": 1,
    "name": "魏8",
    "email": "64@yahoo.com"
  },
  {
    "id": 2,
    "name": "余_鑫鹏",
    "email": ".@hotmail.com"
  },
  {
    "id": 3,
    "name": "钱83",
    "email": "54@hotmail.com"
  },
  {
    "id": 4,
    "name": "杜.航19",
    "email": "9@gmail.com"
  },
  {
    "id": 5,
    "name": "白.耀杰",
    "email": "92@yahoo.com"
  },
  {
    "id": 6,
    "name": "石73",
    "email": "30@hotmail.com"
  },
  {
    "id": 7,
    "name": "田.越彬",
    "email": "78@hotmail.com"
  },
  {
    "id": 8,
    "name": "徐34",
    "email": ".@hotmail.com"
  },
  {
    "id": 9,
    "name": "金44",
    "email": "35@gmail.com"
  },
  {
    "id": 10,
    "name": "洪24",
    "email": "_@gmail.com"
  }
]

# curl -X GET localhost:3000/api/user/1 -> GET /
{
  "id": 1,
  "name": "魏8",
  "email": "64@yahoo.com"
}

# curl -X GET localhost:3000/api/user?name_like=4 -> GET /
[
  {
    "id": 8,
    "name": "徐34",
    "email": ".@hotmail.com"
  },
  {
    "id": 9,
    "name": "金44",
    "email": "35@gmail.com"
  },
  {
    "id": 10,
    "name": "洪24",
    "email": "_@gmail.com"
  }
]
```

更多请求方式请参考[json-server](https://github.com/typicode/json-server#routes)文档

## License

MIT - [xiewulong](https://github.com/xiewulong)
