$(function () {
    var layer = layui.layer;
    // 1.获取用户信息
    getUserInfo();

    // 2.退出 (点击事件添加)
    $('#btnlogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('是否确认退出', { icon: 3, title: '提示' }, function (index) {
            // 1.清空本地存储的token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html';
            // 3.关闭询问框
            layer.close(index);
        });
    })
})
var layer = layui.layer;
// 获取用户信息 （封装到入口函数外面是因为后面其他页面也需要调用）
function getUserInfo() {
    // 发送ajax方法获取
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 设置请求头信息
        // headers: {
        //     // 重新登录，因为 token过期时间 12个小时
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) return layer.msg(res.message)
            // 请求成功，渲染头像
            renderAvatar(res.data)
        }
    });
}

// 封装渲染头像函数
function renderAvatar(user) {
    // 1.渲染名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('#welcome').hide();
    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        // 获取 name 首字母 并弄成大写
        var text = name[0].toUpperCase();
        $('.text_avatar').show().html(text);
    }
}