const fs = require('fs');
const path = require('path');
// const crypto = require('crypto');
// const bcrypt = require('bcrypt');
const file_path = path.resolve(__dirname,'user.json')
const password_path = path.resolve(__dirname,'password.json')


const express = require('express');
const { v4 } = require('uuid');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,token');
  res.header('content-type', 'application/json;charset=utf-8');
  next();
});

let List=JSON.parse(fs.readFileSync(file_path, 'utf8'))
let token=''
function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
      '{"' +
      decodeURIComponent(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
      '"}'
  );
}
function validateToken(req) {
  const headers = req.headers;
  const ReqToken = headers.token
  const compareToken=token||fs.readFileSync(password_path);
  console.log('ReqToken'+ReqToken)
  console.log('token'+compareToken)
  return ReqToken === compareToken;
}

// let List = [];


//登录
app.post('/permission/getMenu', (req, res) => {
  const { username, password } = req.body
  //其中password为前端传过来由md5('123456')加密而成的，为什么会输出'not match'
  // 先判断用户是否存在
  // 判断账号和密码是否对应
    if (username === 'NGzhinengyanjiusuo' && password === 'e10adc3949ba59abbe56e057f20f883e') {
    //14e1b600b1fd579f47433b88e8d85291
    token=v4()
      fs.writeFile(password_path, token,()=>{})
      res.json({
      code: 20000,
      data: {
        menu: [
          {
            path: '/admin',
            name: 'admin',
            label: '表情管理',
            icon: 'picture',
            url: 'Admin.vue'
          },
        ],
        token: token,
        message: '获取成功'
    }})}
    else if (username === 'putongyonghu' && password === '123456') {
      res.json({
        code: 20000,
        data: {
          menu: [
            {
              path: '/upload',
              name: 'upload',
              label: '表情管理',
              icon: 'picture',
              url: 'Admin.vue'
            },
          ],
          message: '获取成功'
        }
      })
  } else {
      res.json({
        code: -999,
        data: {
          message: '密码错误'
        }
      })
  }
});
//获取数据
app.get('/user/getUser', (req, res) => {
  //响应头设置
  const { name, sortname, sortorder, page = 1, limit = 20 } = param2Obj(req.url);
  console.log('name:' + name, 'page:' + page, '分页大小limit:' + limit)
  let mockList = List.filter((user) => {
    let tagReduce =
        user.tags.length === 1
            ? user.tags[0].name
            : user.tags.reduce((left, right) => {
              return (left.name || left) +  right.name;
            });
    if (name && tagReduce.indexOf(name) === -1 && user.other.indexOf(name) === -1) return false;
    return true;
  });

  if (sortorder === 'desc')
    mockList.sort((a, b) => {
      return b[sortname] - a[sortname];
    });
  else if (sortorder === 'asc')
    mockList.sort((a, b) => {
      return a[sortname] - b[sortname];
    });
  const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

  res.json({data:{
    code: 200,
    count: mockList.length,
    list: pageList,
  }});
});

//增加数据
app.post('/user/add', (req, res) => {
  if (!validateToken(req)) {
    res.status(401).json({
      code: 401,
      message: '验证失败或者token不正确',
    });
    return;
  }
  console.log(1)
  const { tags, other,  audit, fileList } = req.body;
  const upTime = new Date().toLocaleDateString();
  // List=JSON.parse(fs.readFileSync(file_path, 'utf8'))
  // fs.appendFileSync(file_path,JSON.stringify({
  //   id: v4(),
  //   tags: tags,
  //   other: other,
  //   upTime: upTime,
  //   audit: audit,
  //   fileList: fileList,
  // }));
  List.unshift({
    id: v4(),
    tags: tags,
    other: other,
    upTime: upTime,
    audit: audit,
    fileList: fileList,
  });
  fs.writeFileSync(file_path, JSON.stringify(List, null, 2), 'utf8');
  res.status(200).json({
    code: 200,
    data: {
      message: '添加成功',
    },
  });
});

//编辑数据
app.post('/user/edit', (req, res) => {
  const { id, tags, other,  upTime, audit, fileList } = req.body;
  const audit_num = parseInt(audit);
  List.some((u) => {
    if (u.id === id) {
      u.tags = tags;
      u.other = other;
      u.upTime = upTime;
      u.fileList = fileList;
      u.audit = audit_num;
      return true;
    }
  });
  fs.writeFileSync(file_path, JSON.stringify(List, null, 2), 'utf8');
  res.status(200).json({
    code: 200,
    data: {
      message: '编辑成功',
    },
  });
});

//删除
app.post('/user/del', (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.json({
      code: -999,
      message: '参数不正确',
    });
  } else {
    List = List.filter((u) => u.id !== id);
    fs.writeFileSync(file_path, JSON.stringify(List, null, 2), 'utf8');
    res.status(200).json({
      code: 200,
      message: '删除成功',
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
