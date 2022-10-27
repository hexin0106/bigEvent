//获取用户信息 
getUserInfo()

function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        // 请求头配置
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败', {
                    icon: 5
                })
            }
            //如果成功 渲染用户头像 '欢迎xxx'
            renderAvator(res.data)
        }
    });
}
/*封装一个渲染用户头像的函数
用户名如果有昵称 头像是昵称的第一个文字
如果没有昵称 显示用户名
如果头像 把头像图片传给img显示头像*/
function renderAvator(user) {
    var name = user.nickname || user.username
    //设置欢迎词
    $('#welcome').html('欢迎: ' + name)
    //渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }
}
/*
退出功能：点击退出 弹窗提示 退出到登陆页面
*/
$('#btnLogout').on('click', function () {
    layer.confirm('是否退出', {
        icon: 3,
        title: '提示'
    }, function (index) {
        //跳转到登陆页面，清除当前本地中的token
        localStorage.removeItem('token')
        location.href = '/login.html'
        //关闭询问框
        layer.close(index);
    });
})
//登陆时 控制用户权限:如果用户未登录 直接打开index.html页面时应该不能进入、返回登陆页面的