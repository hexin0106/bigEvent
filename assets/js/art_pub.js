//获取文章分类
var form = layui.form
var layer = layui.layer

function initCate() {
    $.ajax({
        type: "get",
        url: "/my/article/cates",
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类失败')
            }
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            //因为数据是在UI结构完毕后才获取的 所以需要重新渲染表单内容
            form.render()
        }
    });
}
initCate()
// 初始化富文本编辑器
initEditor()
//封面功能
// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)
//点击按钮 调用隐藏文件域的点击事件
$('#chooseImage').on('click', function (e) {
    e.preventDefault();
    $('#coverFile').click()
})
//更换裁剪图片
$('#coverFile').on('change', function (e) {
    var files = e.target.files
    if (files.length <= 0) {
        return layer.msg('没有图片封面')
    }
    var newImgURL = URL.createObjectURL(files[0])
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
})
//文章状态设置
var art_state = '已发布'
$('#btnSave2').on('click', function (e) {
    // e.preventDefault()
    art_state = '草稿'
})
//收集表单数据(因为有文件上传,所以不能用serialize,要用formdata对象)
$('#form-pub').on('submit', function (e) {
    e.preventDefault()
    //实例化formdata对象
    var fd = new FormData($(this)[0])
    //添加文章状态
    fd.append('state', art_state)
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            //添加封面
            fd.append('cover_img', blob)
            //调用发布文章的请求 因为toblob是回调函数 所以在回调函数内发起请求
            pubArticle(fd)
        })
    // fd.forEach(function (v, k) {
    //     console.log(v, k);
    // })
})
//发起请求 发布文章
function pubArticle(fd) {
    $.ajax({
        type: "post",
        url: "/my/article/add",
        data: fd,
        //文件上传的JQ属性设置
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('文章发布失败')
            }
            layer.msg('文章发布成功')
            window.parent.$('#a_list').click()
            location.href = '/article/art_list.html'
        }
    });
}