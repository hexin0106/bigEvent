//封装函数 获取文章列表
//因为需要传递的参数比较多 并且筛选的时候 参数会改变
//所以先创建一个对象 用来接收对象所有请求时候的参数
var layer = layui.layer
var form = layui.form
//定义layui的分页
var laypage = layui.laypage
var q = {
    pagenum: 1,
    pagesize: 2,
    // cate_id: 3,
    // state: 4
}
//初始化调用
initTable()
//template时间过滤器
function addZero(n) {
    return n < 10 ? '0' + n : n
}
template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = addZero(dt.getMonth()) + 1
    var d = addZero(dt.getDate())
    var hh = addZero(dt.getHours())
    var mm = addZero(dt.getMinutes())
    var ss = addZero(dt.getSeconds())
    return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
}
//获取文章列表
function initTable() {
    $.ajax({
        type: "get",
        url: "/my/article/list",
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('失败')
            }
            //成功后 渲染页面 使用模板引擎
            // console.log(res);
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            //调用分页的函数
            renderPage(res.total)
        }
    });
}

//封装函数获取文章分类 渲染到分类的选项中
function initCate() {
    $.ajax({
        type: "get",
        url: "/my/article/cates",
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类列表失败')
            }
            //渲染到下拉列表中
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            //解决先渲染UI结构的时候 layui未获取到template传过来的数据问题 使用form.reander()方法更新表单渲染
            form.render()
        }
    });
}
//初始化调用 渲染文章分类
initCate()

//筛选功能的实现
//根据文章的Id和状态筛选文章，收集表单数据 调用initTable()
$('#form-search').on('submit', function (e) {
    e.preventDefault();
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    //重新调用渲染表格的函数
    initTable()
})

//分页功能：封装分页函数
//分页的方式：数据的总数/每页显示的条数=页码数
function renderPage(total) {
    //形参是数据的总数量，从渲染table处获取
    laypage.render({
        elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
        count: total, //数据总数，从服务端得到
        limit: q.pagesize, //每页显示几条数据
        curr: q.pagenum, //默认选中哪一页
        jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            // console.log(obj.limit); //得到每页显示的条数
            //首次不执行
            if (!first) {
                initTable()
            }
        },
        layout: ['prev', 'page', 'next', 'skip', 'refresh', 'limit'],
        limits: [2, 3, 5, 10]
    })
}

//删除
$('tbody').on('click', '.btn-delete', function (e) {
    //点击删除 判断当前页面删除按钮的数量 如果当前的数量1 让页码的值-1
    var len = $('.btn-delete').length
    //得到当前删除按钮的id
    var id = $(this).attr('data-id')
    e.preventDefault()
    layer.confirm('是否删除?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            type: "get",
            url: "/my/article/delete/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除失败')
                }
                layer.msg('删除成功')
                //在页面重新渲染之前 让页码值-1 但是不能未0
                if (len === 1) {
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum--
                }
                initTable()
            }
        });
        //关闭弹窗
        layer.close(index)
    })
})