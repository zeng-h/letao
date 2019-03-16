// 搜索列表页面的逻辑代码
// 定义一个全局变量 存储搜索的内容
var proName = '';


$(function () {
  // 页面刚加载调用当前查询商品的函数
  queryProduct();
  // 调用当前商品搜索页面的搜索功能
  searchProduct();
  // 调用排序功能
  productSort();
  // 调用下拉刷新和上拉记载的功能函数
  pullRefresh();
  // 调用跳转到商品详情的函数
  gotoDetail();

  // 1. 查询产品的函数
  function queryProduct() {
    // 1. 获取搜索页面传过来的参数 即获取url里传过来的值
    proName = getQueryString('search');
    // 2. 根据搜索传过来的内容请求数据库，渲染页面
    $.ajax({
      url: '/product/queryProduct',
      // 注意：page 第几页 pagesize 每页显示的数量是必须传的参数，没有传的话nodejs后台会挂掉
      data: {
        page: 1,
        pageSize: 4,
        proName: proName
      },
      success: function (res) {
        // console.log(res)
        // 3. 调用模板
        // 如果没有数据，则提示没有数据了
        if (res.data.length > 0) {
          var html = template('productListTpl', res);
          $('.content .mui-row').html(html);
        } else {
          $('.content .mui-row').html('真的没有商品啦，要不试试别的~');
        }

      }
    });
  }

  // 2. 商品列表的搜索也应该有和搜索页面的搜索有相同的效果
  function searchProduct() {
    //  给搜索按钮注册点击事件，使用zepto都使用tap事件 解决了点击事件的延迟
    $('.search-btn').on('tap', function () {
      // 去除输入内容左右两边的空格
      proName = $('.search>input').val().trim();
      // console.log(searchText);
      // 进行非空判断
      if (proName == '') {
        mui.toast('请输入合法的内容', {
          duration: 'long',
          type: 'div'
        });
        return false;
      }
      // 把之前记录加入到数组中， 这个数组要看之前有没有数据，有就使用之前数组去加，没有就使用新的空数组
      var searchHistory = localStorage.getItem('searchHistory');
      // 判断数组之前有没有值
      if (searchHistory) {
        // 转换成数组
        searchHistory = JSON.parse(searchHistory);
      } else {
        // 没有就使用空数组
        searchHistory = [];
      }
      // console.log(searchHistory);
      // 在添加之前还要去重 把重复的值都删除掉
      // 循环遍历整个数组
      for (var i = 0; i < searchHistory.length; i++) {
        // 判断当前数组中的每个值的key是否和当前输入的一致
        if (searchHistory[i].key == proName) {
          searchHistory.splice(i, 1);
          // 如果有多个重复的数据， 删掉一个值数组的长度就少了一个
          i--;
        }
      }
      // 往数组里面添加值，往前面添加
      searchHistory.unshift({
        key: proName,
        time: new Date().getTime()
      });
      // 把数组转成json字符串存储到本地存储中
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      // 清空输入框中的内容
      $('.search>input').val('');
      // 添加完成后调用获取商品的函数，更新页面
      location = 'productlist.html?search=' + proName + '&time=' + new Date().getTime();
    });
  }

  // 3. 根据价格和销量进行排序
  function productSort() {
    // 1. 给标题里面的所有的上架时间 价格 销量等注册点击事件
    $('.title a').on('tap', function () {
      // 2. 让当前选中的颜色变红 其他的兄弟元素移除这个类
      $(this).addClass('active').siblings().removeClass('active');
      // 3. i标签里面的箭头方向也应该改变，根据排序方式进行判断 默认值是2 为降序
      var type = $(this).data('num');
      // 2代表降序 1 代表升序
      if (type == 2) {
        type = 1;
        $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
      } else {
        type = 2
        $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
      }
      //4. 更新页面上属性值
      $(this).data('num', type);
      // 5. 获取当前的排序方式
      var sortNum = $(this).data('num');
      // console.log(sortNum);
      // 6. 发送请求获取数据
      // 因为可能是按照价格也可能是按照销量进行排序，所以我们获取的data-type是一个数组
      var sortType = $(this).data('type');
      // console.log(sortType);
      var obj = {
        page: 1,
        pageSize: 4,
        proName: proName,
      }
      obj[sortType] = sortNum;
      // console.log(obj);
      $.ajax({
        url: '/product/queryProduct',
        // 注意：page 第几页 pagesize 每页显示的数量是必须传的参数，没有传的话nodejs后台会挂掉
        data: obj,
        success: function (res) {
          // console.log(res);
          //调用模板
          var html = template('productListTpl', res);
          $('.content .mui-row').html(html);
        }
      })

    });
  }

  // 4. 实现下拉刷新和上拉加载更多的效果
  function pullRefresh() {
    mui.init({
      pullRefresh: {
        container: '#pullrefresh',
        down: {
          callback: pulldownRefresh
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
        queryProduct();
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
        mui('#pullrefresh').pullRefresh().refresh(true);
        page = 1;
      }, 1000)

    }
    var page = 1;
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
      setTimeout(function () {
        $.ajax({
          url: '/product/queryProduct',
          // 注意：page 第几页 pagesize 每页显示的数量是必须传的参数，没有传的话nodejs后台会挂掉
          data: {
            page: ++page,
            pageSize: 4,
            proName: proName
          },
          success: function (res) {
            // console.log(res)
            // 3. 调用模板
            if (res.data.length > 0) {
              var html = template('productListTpl', res);
              $('.content .mui-row').append(html);
              mui('#pullrefresh').pullRefresh().endPullupToRefresh();
            } else {
              mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
            }
          }
        });
      }, 1000)
    }
  }

  // 5. 点击立即购买跳转到商品详情页面
  function gotoDetail() {
    // 给立即购买按钮注册点击事件
    $('.content .mui-row').on('tap', '.btn-buy', function () {
      // 获取点击商品的id
      var id = $(this).data('id');
      // console.log(id);
      // 跳转到商品详情页面,并把id传过去
      location = 'detail.html?id=' + id;
    });
  }
  // 封装一个获取url参数的函数
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }

});