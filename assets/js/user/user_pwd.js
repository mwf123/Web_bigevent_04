$(function () {

    var form = layui.form
    // 提示框
    var layer = layui.layer
    // 1.定义校验规则
    form.verify({
        // 1.1 密码
        pwd: [
            /^[\S]{6,12}$/, "密码必须是6~12为，且不能有空格",
        ],
        // 1.2 新旧不重复
        samePwd: function (value) {
            // value 是新密码，旧密码需要获取
            if (value == $("[name=oldPwd]").val()) return "原密码和就密码不能相同！"
        },
        // 1.3 两次密码必须相同
        rePwd: function (value) {
            // value 是再次输入的密码，新密码需要获取
            if (value !== $("[name=newPwd]").val()) return "两次密码输入不一致！"
        }
    })

    // 2.表单提交
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                // 判断失败状态
                if (res.status !== 0) return layer.msg(res.message)
                // 修改密码成功
                layer.msg("修改密码成功!")
                // 清空表单内容
                $('.layui-form')[0].reset();
            }
        });
    })

})