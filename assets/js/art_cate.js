//先封装函数--获取封装分类列表
var layer = layui.layer
var form = layui.form
getInitCateList()

function getInitCateList() {
    $.ajax({
        type: "get",
        url: "/my/article/cates",
        success: function (res) {
            console.log(res);
            //如果不成功
            if (res.status !== 0) {
                return layui.layer.msg('获取文章分类失败')
            }
            //如果成功
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    });
}
//创建变量 用来接收弹出层的索引号
var indexAdd = null
//添加文章分类
$('#btnAddCate').on('click', function (e) {
    e.preventDefault();
    indexAdd = layer.open({
        type: 1,
        title: '添加文章分类',
        area: ['500px', '250px'],
        content: $('#dialog-add').html()
    });
})
//点击提交新增文章分类
//事件委托给body 因为是JS添加到页面上的
$('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
        type: "post",
        url: "/my/article/addcates",
        data: $(this).serialize(),
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('新增文章分类失败')
            }
            //1.关闭弹出层 2.调用获取分类列表的函数
            getInitCateList()
            layer.msg('新增文章分类成功')
            layer.close(indexAdd)
        }
    });
})
//取消
$('body').on('click', '.btnReset', function (e) {
    e.preventDefault()
    layer.close(indexAdd)
    layer.close(indexEdit)
})
//修改文章分类 1.先获取当前id对应的表单数据 在弹出层显示
var indexEdit = null
$('tbody').on('click', '.btn-edit', function (e) {
    e.preventDefault()
    indexEdit = layer.open({
        type: 1,
        title: '修改文章分类',
        area: ['500px', '250px'],
        content: $('#dialog-edit').html()
    });
    //先要得到被点击的按钮的自定义属性data-Id
    var id = $(this).attr('data-id')
    //根据id获取对应的文章分类数据
    $.ajax({
        type: "get",
        url: "/my/article/cates/" + id,
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取文章分类失败')
            }
            //成功渲染页面 填充表单数据
            form.val('form-edit', res.data)
        }
    });
    //  2.确认修改
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //成功 关闭弹出层 渲染页面
                getInitCateList()
                layer.msg(res.message)
                layer.close(indexEdit)
            }
        });
    })
})
//3.通过id找到当前数据 点击确定 发请求删除文章分类
$('tbody').on('click', '.btn-delete', function (e) {
    e.preventDefault()
    var id = $(this).attr('data-id')
    layer.confirm('是否删除?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        //do something
        $.ajax({
            type: "get",
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除失败')
                }
                layer.close(index)
                layer.msg(res.message)
                getInitCateList()
            }
        });
    })
})