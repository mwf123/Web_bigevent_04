$(function () {
    var layer = layui.layer;
    var form = layui.form;


    // 1.点击去注册账号，隐藏登录区域，显示注册区域
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    // 2.点击去登录，隐藏注册区域，显示登录区域
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    })

    // 3.自定义表单验证规则
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6-16为，且不能输入空格"
        ],
        // 确认密码规则
        repwd: function (val) {
            // 获取密码框的值
            var pwd = $(".reg_box input[name=password]").val();
            // 判断
            if (val !== pwd) {
                return "两次密码不一致"
            }
        }
    })

    // 4.注册功能
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: $('.reg_box [name=username]').val(),
                password: $('.reg_box [name=password]').val(),
            },
            success: function (res) {
                // 返回判断值
                if (res.status !== 0) return layer.msg('注册失败！' + res.meassage);
                // 提交成功后，处理代码
                layer.msg('注册成功！请登录');
                // 手动切换至登录表单
                $('#link_login').click();
                // 重置form表单
                $('#form_reg')[0].reset();
            }
        });
    })


    // 登录功能 给form表单绑定 submit监听事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送 ajax 请求
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // 返回校验状态
                if (res.status !== 0) return layer.msg("登录失败！");
                // 提示信息，保存 token 跳转页面
                layer.msg('恭喜您登录成功！')
                // 保存 token 未来接口要使用
                localStorage.setItem('token', res.token);
                location.href = '/index.html'
            }
        });
    })
})