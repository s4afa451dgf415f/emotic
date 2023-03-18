import Mock from 'mockjs'
export default {
    getMenu: config => {
        const { username, password } = JSON.parse(config.body)
        // 先判断用户是否存在
        // 判断账号和密码是否对应
        if (username === 'NGzhinengyanjiusuo' && password === '123456') {
            return {
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
                        // {
                        //     path: '/user',
                        //     name: 'user',
                        //     label: '表情管理',
                        //     icon: 'user',
                        //     url: 'User.vue'
                        // },
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'
                }
            }
        } else if (username === 'putongyonghu' && password === '123456') {
            return {
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
            }
        } else {
            return {
                code: -999,
                data: {
                    message: '密码错误'
                }
            }
        }

    }
}
