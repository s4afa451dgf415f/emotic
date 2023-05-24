import Cookie from "js-cookie";

export default {
    state: {
        isCollapse: false, //用于控制菜单收展
        menu: [],
        tableList: [{
            path: '/',
            name: 'admin',
            label: '表情管理',
            icon: 's-home',
            url: 'admin/admin'
        }] ,//用于控制菜单收展
        getCancelTokenList:[],
    },
    mutations: {
        //canceltoken
        setCancelTokenList(state,val){
            state.getCancelTokenList=val
        },
        //修改菜单方法
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        //更新面包屑数据
        selectMenu(state, val) {
            if (val.name !== 'emotic') {
                // if(state.tableList.indexOf(val)===-1){
                //     state.tableList.push(val)
                // }
                if (state.tableList.findIndex(item => item.name === val.name) === -1) state.tableList.push(val) //findIndex较indexof更加强大，能穿透数组对象进行查找
            }
        },
        //删除tag数据
        closeTag(state, val) {
            state.tableList.splice(state.tableList.findIndex(item => item.name === val.name), 1)
        },
        //设置menu的数据
        setMenu(state, val) {
            state.menu = val
            Cookie.set('menu', JSON.stringify(val))
        },
        //动态注册路由
        addMenu(state, router) {
            //判断缓存中是否有数据
            if (!Cookie.get('menu')) return
            const menu = JSON.parse(Cookie.get('menu'))
            state.menu = menu
            //组装动态路由的数据
            const menuArray = []
            menu.forEach(item => {
                if (item.children) {
                    item.children = item.children.map(item => {
                            item.component = () => import(`../views/${item.url}`)
                        console.log(item)
                            return item
                        }
                    )
                        menuArray.push(...item.children)
                } else {
                    item.component = () => import(`../views/${item.url}`)
                    menuArray.push(item)
                }
            })
            //路由的动态添加
            menuArray.forEach(item=>{
                router.addRoute('Main',item)
            })
            console.log(router)
        }

    }
}
