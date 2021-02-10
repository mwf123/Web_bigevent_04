$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1.文章类别列表展示
    initArtCateList();

    // 封装函数
    function initArtCateList() {
        // 发送ajax
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var str = template('tpl-art-cate', res)
                // 渲染到 tbody 里面
                $('tbody').html(str)
            }
        });
    }

    // 2.添加文章类别
    $('#btnAdd').on('click', function () {
        // 利用框架代码，显示提示添加文章类别的区域
        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            area: ["500px", '250px'],
            content: $('#dialog-add').html(),
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。     
    })

    // 3.提交文章分类添加
    var indexEdit = null
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 添加成功，重新渲染页面
                initArtCateList();
                layer.msg('恭喜您,文章类别添加成功！')
                // 关闭弹框
                layer.close(indexAdd)
            }
        });
    })

    // 4.修改文章类别（展示）
    $('tbody').on('click', '.btn-edit', function () {
        // 4.1 利用框架代码，显示提示添加文章类别的区域
        indexEdit = layer.open({
            type: 1,
            title: "修改文章分类",
            area: ["500px", '250px'],
            content: $('#dialog-edit').html(),
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。     

        // 4.2 获取 id，发送ajax获取数据，渲染到页面
        var Id = $(this).attr('data-id');
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        });
    })

    // 4.提交修改
    $('body').on('submit', "#form-edit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 修改成功，提示 重新渲染页面
                initArtCateList();
                layer.msg("恭喜您，文章类别更新成功！")
                layer.close(indexEdit);
            }
        });
    })


    // 5.删除
    $('tbody').on('click', ".btn_delete", function () {
        // 先获取 id 
        var Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发送ajax
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + Id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    // 删除成功 重新渲染页面
                    initArtCateList();
                    layer.msg("恭喜您，删除文章类别成功！")
                    // 关闭提示框
                    layer.close(index);
                }
            });


        });
    })
})