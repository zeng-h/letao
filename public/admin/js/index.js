// 声明两个全局变量，用来存储当前页和总的页码数
var currentPage = 1; //当前页
var totalPage = 0; //总页数

$(function () {
  // 主页js逻辑代码
  queryUser();
  updateUser();

  // 查询用户信息的函数
  function queryUser() {
    $.ajax({
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: 4
      },
      success: function (data) {
        console.log(data);
        // 调用模板
        var html = template('queryUserTpl', data);
        $('.table-list tbody').html(html);
        // 初始化之前要计算出当前总共分几页 总条数/每页的大小
        totalPage = Math.ceil(data.total / data.size);
        // 得到数据之后再渲染页面的初始化
        initPage();
      }

    })
  }

  // 更新用户状态的函数
  function updateUser() {

    // 给所有的按钮添加点击事件
    $('.table-list tbody').on('click', '.btn-option', function () {
      // 获取当前点击的按钮的id和isdelete状态
      var id = $(this).data('id');
      var isDelete = $(this).data('isdelete');
      // 判断这个值，如果是0 改成1 如果是1改成0
      isDelete = isDelete == 0 ? 1 : 0;
      // 把页面上属性也改变 但是jquery的data函数可以修改但是页面显示不出来
      $(this).data('isdelete', isDelete);
      $.ajax({
        url: '/user/updateUser',
        type: 'post',
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function (res) {
          console.log(res);
          if (res.success) {
            queryUser();
          }

        }
      })
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
      numberOfPages: 5, //每次显示页数
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
        queryUser();
      }
    });

  }

});