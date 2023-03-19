import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

let List = []
let typeList=['','success','info','warning','danger']
const count = 200

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      tags: Array.from({ length: Math.floor(Math.random()*5)+1 }, (e,i)=>{return {name:Mock.Random.ctitle(1,5),type:typeList[i]}}),
      other: Mock.Random.cparagraph(0,2),
      scale: Mock.Random.float(0, 5, 0, 4),
      upTime: Mock.Random.date(),
      audit: Mock.Random.integer(0, 1),
      fileList:Array.from({ length: Math.floor(Math.random()*5)+1 },()=>Mock.Random.dataImage("100x100"))
    })
  )
}

export default {
  /**
   * 获取列表
   * 要带参数 tags, page, limt; name可以不填, page,limit有默认值。
   * @param tags, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserList: config => {
    console.log(param2Obj(config.url), 'config')
    const { name, sortname,sortorder,page = 1, limit = 20 } = param2Obj(config.url)
    console.log('name:' + name, 'page:' + page, '分页大小limit:' + limit)
    let mockList = List.filter(user => {
      let tagReduce=user.tags.length === 1?user.tags[0].name:user.tags.reduce((left, right) => { return left.name||left + right.name})
      if (name && tagReduce.indexOf(name) === -1 && user.other.indexOf(name) === -1) return false
      return true
    })
    console.log(mockList,sortorder)
    if(sortorder==='desc')
      mockList.sort((a,b)=>{
            return b[sortname]-a[sortname];
          }
      )
    else if(sortorder==='asc')
    mockList.sort((a,b)=>{
        return a[sortname]-b[sortname];
      })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    console.log(pageList)
    return {
      code: 20000,
      count: mockList.length,
      list: pageList
    }
  },
  /**
   * 增加表情
   * @param name, other, scale, upTime, audit
   * @return {{code: number, data: {message: string}}}
   */
  createUser: config => {
    const { tags, other, scale,  audit,fileList } = JSON.parse(config.body)
    const upTime=new Date().toLocaleDateString();
    List.unshift({
      id: Mock.Random.guid(),
      tags: tags,
      other: other,
      scale: scale,
      upTime:upTime ,
      audit: audit,
      fileList:fileList,
    })
    return {
      code: 20000,
      data: {
        message: '添加成功'
      }
    }
  },
  /**
   * 删除表情
   * @param id
   * @return {*}
   */
  deleteUser: config => {
    const { id } = JSON.parse(config.body)
    if (!id) {
      return {
        code: -999,
        message: '参数不正确'
      }
    } else {
      List = List.filter(u => u.id !== id)
      return {
        code: 20000,
        message: '删除成功'
      }
    }
  },
  /**
   * 批量删除
   * @param config
   * @return {{code: number, data: {message: string}}}
   */
  batchremove: config => {
    let { ids } = param2Obj(config.url)
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    return {
      code: 20000,
      data: {
        message: '批量删除成功'
      }
    }
  },
  /**
   * 修改表情
   * @param id, tags, other, scale, upTime, audit
   * @return {{code: number, data: {message: string}}}
   */
  updateUser: config => {
    const { id, tags, other, scale, upTime, audit,fileList } = JSON.parse(config.body)
    const audit_num = parseInt(audit)
    List.some(u => {
      if (u.id === id) {
        u.tags = tags
        u.other = other
        u.scale = scale
        u.upTime = upTime
        u.fileList =fileList
        u.audit = audit_num
        return true
      }
    })
    return {
      code: 20000,
      data: {
        message: '编辑成功'
      }
    }
  }
}
