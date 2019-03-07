var page = 0;
$(function () {

  queryCart();
  pullRefresh();


  // 请求接口动态渲染页面
  function queryCart() {
    $.ajax({
      url: '/cart/queryCartPaging',
      data: {
        page: 1,
        pageSize: 4
      },
      success: function (res) {
        // console.log(res);
        // 调用模板
        var html = template('cartTpl', res);
        $('.mui-table-view').html(html);
      }


    })
  }

  // 4. 实现下拉刷新和上拉加载更多的效果
  function pullRefresh() {
    // 初始化
    mui.init({
      pullRefresh: {
        container: '#pullrefresh',
        down: {
          callback: pulldownRefresh,
          contentrefresh: "正在加载..."
        },
        up: {
          contentrefresh: '正在加载...',
          callback: pullupRefresh
        }
      }
    });
    /**
     * 下拉刷新具体业务实现
     */
    function pulldownRefresh() {
      setTimeout(function () {
        queryCart();
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      }, 1000)

    }
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
      setTimeout(function () {
        $.ajax({
          url: '/cart/queryCartPaging',
          // 注意：page 第几页 pagesize 每页显示的数量是必须传的参数，没有传的话nodejs后台会挂掉
          data: {
            page: ++page,
            pageSize: 4,
          },
          success: function (res) {
            console.log(res)
            // 3. 调用模板
            if (res.data) {
              var html = template('cartTpl', res);
              $('.mui-table-view').append(html);
              mui('#pullrefresh').pullRefresh().endPullupToRefresh();
            } else {
              mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
            }
          }
        });
      }, 1000)
    }
  }




});