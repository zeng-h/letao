var page = 0;
$(function () {

  queryCart();
  pullRefresh();
  deleteCartProduct();
  editorCartProduct();



  // 1. 请求接口动态渲染页面
  function queryCart() {
    $.ajax({
      url: '/cart/queryCartPaging',
      data: {
        page: 1,
        pageSize: 4
      },
      success: function (res) {
        console.log(res);
        if (res.error) {
          //如果没有登录，就跳转到登录页面
          location = 'login.html?returnURL=' + location.href;
        } else {
          // 调用模板
          var html = template('cartTpl', res);
          $('.mui-table-view').html(html);
          // 计算总金额的函数要在渲染完成后再调用 不然获取不到元素
          getTotalAmount();
          // 6. 给复选框注册值改变事件,也需要再渲染完成后调用
          $('.left input').on('change', function () {
            // 然后重新调用一下计算总金额的函数
            getTotalAmount();
          })
        }

      }


    })
  }

  // 2. 实现下拉刷新和上拉加载更多的效果
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
      }, 1000);
      mui('#pullrefresh').pullRefresh().refresh(true);
      page = 0;

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
              // 然后重新调用一下计算总金额的函数
              getTotalAmount();
            } else {
              mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
            }
          }
        });
      }, 1000);
    }
  }

  // 3. 实现删除功能
  function deleteCartProduct() {
    $('.mui-table-view').on('tap', '.delete-btn', function () {
      // console.log(this);

      // 获取当前点击删除按钮的父元素的父元素
      var li = this.parentNode.parentNode; //这里必须要是dom元素，因为mui不依赖任何库
      // 获取要删除的id
      var id = $(this).data('id');
      // console.log(id);
      mui.confirm('您真的要删除我吗？', '温馨提示', ['残忍删除', '再看看'], function (e) {
        // 判断用户点击了删除还是再看看
        if (e.index == 1) {
          // 这里表示不删
          setTimeout(function () {
            mui.swipeoutClose(li);
          }, 500);
        } else {
          $.ajax({
            url: '/cart/deleteCart',
            data: {
              id
            },
            success: function (res) {
              console.log(res);
              if (res.success) {
                // 删除成功
                mui.toast('删除成功!', {
                  duration: 'long',
                  type: 'div'
                });
                queryCart();
              } else {
                mui.toast('删除失败!', {
                  duration: 'long',
                  type: 'div'
                });
              }
            }
          })
        }
      })
    })
  }


  // 4. 实现编辑功能
  function editorCartProduct() {
    $('.mui-table-view').on('tap', '.edit-btn', function () {
      // 获取当前点击删除按钮的父元素的父元素
      var li = this.parentNode.parentNode;
      // 获取当前要编辑的id
      var id = $(this).data('id');
      // console.log(id);
      var product = $(this).data('product');
      var productSize = [];
      console.log(product);
      var productSizeNum = product.productSize.split('-');
      // console.log(productSizeNum);
      var min = productSizeNum[0];
      var max = productSizeNum[1];
      for (var i = +min; i <= +max; i++) {
        productSize.push(i);
      }
      product.productSize = productSize;
      // console.log(productSize);
      var html = template('editProductTpl', product);
      // 由于所有的换行都会转换成br标签，所以要去掉
      html = html.replace(/[\r\n]/g, '');
      // 点击编辑按钮后弹出弹窗
      mui.confirm(html, '编辑商品标题', ['是 ', '否 '], function (e) {
        // console.log(e);
        if (e.index == 0) {
          // 点击了是就请求接口
          // 获取最新选择的size和num去发送请求
          var size = $('.mui-btn.mui-btn-warning').data('size');
          console.log(size);
          var num = mui('.mui-numbox').numbox().getValue();
          console.log(num);
          $.ajax({
            url: '/cart/updateCart',
            type: 'post',
            data: {
              id: id,
              size: size,
              num: num
            },
            success: function (data) {
              // console.log(data);
              if (data.success) {
                // 代表修改成功，则重新渲染页面
                queryCart();
              }
            }
          })
        } else {
          setTimeout(function () {
            mui.swipeoutClose(li);
          }, 500);
        }
      });

      // 5. 记得要初始化,初始化数字输入框
      mui('.mui-numbox').numbox();
      // 6. 初始化size按钮
      $('.sizeNum button').on('tap', function () {
        $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
      });
    })
  }

  // 5. 计算总金额
  function getTotalAmount() {
    // 总金额伪所有选中的商品的单价*数量再相加
    // console.log($('.left input:checked'));
    var price = $('.left input:checked').data('price');
    var num = $('.left input:checked').data('num');
    var sum = 0;
    $('.left input:checked').each(function (ele, index) {
      sum += price * num;
    })
    console.log(sum);
    // toFixed四舍五入
    $('#order .price').html(sum.toFixed(2));
  }









})