const fs = require('fs');
const path = require('path');
const file_path = path.resolve(__dirname,'user.json')


const express = require('express');
const { v4 } = require('uuid');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.statusCode=200
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('content-type', 'application/json;charset=utf-8');
  next();
});
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
// let List = [];
let List=JSON.parse(fs.readFileSync(file_path, 'utf8'))

//获取数据
app.get('/user/getUser', (req, res) => {
  //响应头设置
  res.setHeader('content-type', 'application/json;charset=utf-8');
  const { name, sortname, sortorder, page = 1, limit = 20 } = param2Obj(req.url);
  // List=JSON.parse(fs.readFileSync(file_path, 'utf8'))
  console.log(List)
  let mockList = List.filter((user) => {
    let tagReduce =
        user.tags.length === 1
            ? user.tags[0].name
            : user.tags.reduce((left, right) => {
              return left.name || left + right.name;
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

  res.json({
    code: 200,
    count: mockList.length,
    list: pageList,
  });
});

//增加数据
app.post('/user/add', (req, res) => {
  // console.log(1)
  // res.statusCode = 200;
  res.setHeader('content-type', 'application/json;charset=utf-8');
  const { tags, other, scale, audit, fileList } = req.body;
  const upTime = new Date().toLocaleDateString();
  // List=JSON.parse(fs.readFileSync(file_path, 'utf8'))
  // fs.appendFileSync(file_path,JSON.stringify({
  //   id: v4(),
  //   tags: tags,
  //   other: other,
  //   scale: scale,
  //   upTime: upTime,
  //   audit: audit,
  //   fileList: fileList,
  // }));
  List.unshift({
    id: v4(),
    tags: tags,
    other: other,
    scale: scale,
    upTime: upTime,
    audit: audit,
    fileList: fileList,
  });
  fs.writeFileSync(file_path, JSON.stringify(List, null, 2), 'utf8');
  res.json({
    code: 200,
    data: {
      message: '添加成功',
    },
  });
});

//编辑数据
app.post('/user/edit', (req, res) => {
  const { id, tags, other, scale, upTime, audit, fileList } = req.body;
  const audit_num = parseInt(audit);
  List.some((u) => {
    if (u.id === id) {
      u.tags = tags;
      u.other = other;
      u.scale = scale;
      u.upTime = upTime;
      u.fileList = fileList;
      u.audit = audit_num;
      return true;
    }
  });
  fs.writeFileSync(file_path, JSON.stringify(List, null, 2), 'utf8');
  res.json({
    code: 200,
    data: {
      message: '编辑成功',
    },
  });
});

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
    res.json({
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
