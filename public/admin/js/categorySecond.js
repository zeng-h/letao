// 声明两个全局变量，用来存储当前页和总的页码数
var currentPage = 1; //当前页
var totalPage = 0; //总页数

$(function () {
  querySecondCategory();
  addBrand();

  // 查询二级分类的函数
  function querySecondCategory() {
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: 5
      },
      success: function (data) {
        console.log(data);
        // 调用模板
        var html = template('querySecondCategoryTpl', data);

        $('.table-list tbody').html(html);

        // 5. 初始化之前计算当前总共分几页 使用总条数/每页大小 而且向上取整 如果7/5 = 1.2 == 2
        totalPage = Math.ceil(data.total / data.size);
        // console.log(totalPage);
        // 6. 得在数据渲染完之后才知道要分几页才调用初始化分页的函数
        initPage();
      }
    })
  }

  // 初始化分页插件
  function initPage() {
    /* 
      1. 先引入插件bootstrap-paginator.js文件
      2. 写一个结构 ul
      3. 调用分页插件的初始化函数 传入一堆参数
      4. 当前页码数（控制哪个高亮）
      5. totalPage 总页码数 总条数/每页大小
      6. 总条数是请求了数据之后才知道，所以要等数据渲染完成后再初始化分页插件
      7. 还有一个点击事件 点击每个分页按钮都会触发事件 里面最后一个参数就是当前点击的页码数
      8. 把当前点击的页码数覆盖全局变量页码数
      9. 调用查询刷新页码即可
    */

    $(".page-list").bootstrapPaginator({
      bootstrapMajorVersion: 3, //对应的bootstrap版本
      currentPage: currentPage, //当前页数 也是外面定义的全局变量当前页码数
      numberOfPages: 10, //每次显示页数
      totalPages: totalPage, //总页数 外面定义全局变量totalPage
      shouldShowPage: true, //是否显示该按钮
      useBootstrapTooltip: true,
      //点击事件
      onPageClicked: function (event, originalEvent, type, nowPage) {
        console.log(nowPage);
        // nowPage就是当前点击的每一页
        // 把全局变量的page赋值为当前的nowPage
        currentPage = nowPage;
        // 重新调用查询刷新页面
        querySecondCategory();
      }
    });

  }


  // 添加品牌的函数
  function addBrand() {
    /* 
    1、点击添加品牌的时候要把模态框的分类下拉框动态渲染
    2. 点击图片能够实现图片预览和上传
    3. 点击保存 获取当前选择的分类id 品牌名称 品牌logo 火热品牌（默认为1）
    4. 把品牌信息调用api去添加品牌
    5。 添加成功就调用查询刷新页面
    
    */

    // 点击添加品牌按钮，发送请求获取所有的分类
    $('.add-brand').on('click', function () {
      $.ajax({
        url: '/category/queryTopCategory',
        success: function (data) {
          // console.log(data);
          // 由于结构较为简单，所以就不用模板引擎，直接用字符串拼接
          var str = '';
          // 遍历data.rows
          for (var i = 0; i < data.rows.length; i++) {
            // 根据数组的多少生成多少个option
            str += "<option value=" + data.rows[i].id + ">" + data.rows[i].categoryName + "</option>";
            // console.log(str);
          }
          $('#category-name').html(str);
        }
      });
    });
    var file = null;
    // 文件预览功能,给文件框添加一个change事件
    $('.category-logo').on('change', function () {
      // this就是当前的文件选择框，图片就放在files里面
      // console.dir(this);
      // 判断是否有选择图片，即判断files的长度
      if (this.files.length <= 0) {
        // 没有长度就说明没有选择文件，所以return false
        return false;
      }
      // 这里就代表选择了图片
      file = this.files[0];
      // 获取文件的临时路径
      var path = window.URL.createObjectURL(file);
      // 把临时路径拼接到图片预览的src中
      $('.logoPic').attr('src', path);
    });

    // 给保存按钮注册点击事件
    $('.btn-save').on('click', function () {
      // 获取所有品牌的分类的id logo 名称
      var categoryId = $('#category-name').val();
      console.log(categoryId);
      var brandName = $('.brand-name').val().trim();
      console.log(brandName);

      // 获取当前要上传的图片文件，调用后台图片上传的接口传给后台
      // 如果当前没有选择图片就无法上传后面代码就不执行了
      if (file == null) {
        return false;
      }
      // 创建一个表单数据对象
      var formData = new FormData();
      console.log(file);
      // 把我们的图片append到formData对象上
      // append函数的第一个参数添加键 
      formData.append('pic1', file);
      console.log(formData);

      // 调用ajax指定当前参数就是formData对象
      $.ajax({
        url: '/category/addSecondCategoryPic',
        type: 'post',
        data: formData,
        // 把ajax默认处理数据禁止 不要当成普通对象去处理
        processData: false,
        // 请求报文的类型不要设置
        contentType: false,
        // 取消异步
        async: false,
        // 取消缓存
        cache: false,
        success: function (data) {
          console.log(data);
          // 如果后台返回了对象里面有picAddr表示图片上传成功
          if (data.picAddr) {
            // 获取当前上传成功的真正的图片地址
            var brandLogo = data.picAddr;
            // 调用添加品牌的请求
            $.ajax({
              url: '/category/addSecondCategory',
              type: 'post',
              data: {
                brandName: brandName,
                categoryId: categoryId,
                brandLogo: brandLogo,
                hot: 1
              },
              success: function (data) {
                //  如果返回成功调用查询二级分类列表刷新页面
                if (data.success) {
                  querySecondCategory();
                }
              }
            });
          }

        }
      })



    })



  }

})