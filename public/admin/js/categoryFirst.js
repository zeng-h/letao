// 声明两个全局变量，用来存储当前页和总的页码数
var currentPage = 1; //当前页
var totalPage = 0; //总页数

$(function () {
  queryFirstCategory();
  addCategory();

  // 查询分类的函数
  function queryFirstCategory() {
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage,
        pageSize: 5
      },
      success: function (data) {
        console.log(data);
        // 调用模板
        var html = template('queryFirstCategoryTpl', data);
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
        queryFirstCategory();
      }
    });

  }


  // 添加分类功能函数
  function addCategory() {
    // 给保存按钮注册点击事件
    $('.btn-save').on('click', function () {

      // 获取输入框中输入的内容
      var inputValue = $('.category-name').val().trim();
      // 判断输入的内容是否合法
      if (inputValue == '' || inputValue.length > 3) {
        alert('分类名称不能为空且不能超过3个字');
        return false;
      }
      // console.log(inputValue);
      // 发送请求
      $.ajax({
        url: '/category/addTopCategory',
        type: 'post',
        data: {
          categoryName: inputValue
        },
        success: function (data) {
          // console.log(data);
          if (data.success) {
            // 添加成功就刷新分类页面
            queryFirstCategory();
          }
        }
      })
    })


  }

})