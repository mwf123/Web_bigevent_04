$(function () {
    var layer = layui.layer
    var form = layui.form

    // 为 定义事件过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }
    // 补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 1.定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 2.初始化文章列表
    initTable();
    // 封装初始化文章列表函数
    function initTable() {
        // 发送ajax
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // 判断是否成功 返回数据
                if (res.status !== 0) return layer.msg(res.message)
                // 获取成功，渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
            }
        });
    }

    // 3.初始化分类
    initCate();
    // 封装函数
    function initCate() {
        // 发送ajax
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // 校验
                if (res.status !== 0) return layer.msg(res.message)
                // 赋值，渲染form 
                var htmlStr = template("tpl-cate", res)
                $('[name=cate_id]').html(htmlStr)
                form.render();
            }
        });
    }

    // 4.筛选
    $('#form-search').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 获取
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state
        // 初始化文章列表
        initTable()
    })

    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // alert(total)
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum, // 第几页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10]
            // 触发 jump：分页初始化的时候，页码改变的时候
            , jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // 改变当前页
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    // 初始化文章列表
                    initTable();
                }
            }
        });

    }

    // 6.删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取 id
        var Id = $(this).attr('data-id');
        // 显示询问框
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
                    layer.msg("恭喜您，删除文章成功！")

                    // 页面汇总删除按钮个数等于一，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                    // 关闭提示框
                    layer.close(index);
                }
            });


        });
    })

})