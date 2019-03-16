$(function () {

  queryDetail();
  addCart();

  // 1. 初始化轮播图
  function initSlide() {
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
  }

  // 2. 初始化数字输入框
  function initNum() {
    mui('.mui-numbox').numbox();
  }

  // 3. 初始化区域滚动
  function initScroll() {
    mui('.mui-scroll-wrapper').scroll({
      deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
  }


  // 4. 动态渲染详情页面
  // 根据url中传过来的id请求接口

  function queryDetail() {
    var id = getQueryString('id');
    $.ajax({
      url: '/product/queryProductDetail',
      data: {
        id
      },
      success: function (data) {
        console.log(data);
        // 尺码是一个30-50的字符串，所以需要处理成数组
        // console.log(data.size);
        var arr = data.size.split('-');
        // 定义一个真正的size的数组
        var size = [];
        // console.log(arr);
        // 所以以30伪开始50为结束遍历数组
        // -0和前面+都是为了将字符串转换成数字

        for (var i = +arr[0]; i <= arr[1] - 0; i++) {
          // console.log(i);
          size.push(i);
        }
        data.size = size;
        // 调用模板
        var html = template('detailTpl', data);
        $('#main').html(html);
        // 注意：要在页面渲染完成后记得初始化
        // 1. 初始化轮播图
        initSlide();
        // 2. 初始化数字输入框
        initNum();
        // 3. 初始化区域滚动
        initScroll();
        // 4. 给所有的size按钮注册点击事件,由于是在渲染完成后再来注册的事件，所以可以不用委托
        $('.sizeNum button').on('tap', function () {
          $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
          // 获取选择的size 和数量
          // var size = $(this).data('size');
          // console.log(size);
        });





      }

    })
  }

  function addCart() {
    // 给添加到购物车注册点击事件
    $('.btn-cart').on('tap', function () {
      // 需要把id size和num一起传过去
      var id = getQueryString('id');
      // console.log(id);
      var size = $('.mui-btn.mui-btn-warning').data('size');
      // console.log(size);
      // 这是mui已经封装好的获取字数输入框里面的值的方法
      var num = mui('.mui-numbox').numbox().getValue();
      // console.log(num);
      // 请求接口 如果失败就取到登录页面 成功就取到购物车页面
      $.ajax({
        type: 'post',
        url: '/cart/addCart',
        data: {
          productId: id,
          size: size,
          num: num
        },
        success: function (data) {
          console.log(data);
          if (data.error) {
            // 则表示未登录，跳转到登录页面
            location = 'login.html?returnURL=' + location.href;
          } else {
            // 代表已经登录成功了，跳转到购物车页面
            mui.confirm('加入购物车是否进入购物车查看？', '温馨提示', ['是', '否'], function (e) {
              // console.log(e);
              if (e.index == 1) {
                // 点击了否就提示继续购买
                mui.toast('剁手党请继续剁手!', {
                  duration: 'long',
                  type: 'div'
                });
              } else {
                // 点击了是就取到购物车查看
                location = 'cart.html';
              }
            }, 'div')

          }
        }

      })



    });
  }



  // 封装一个获取url参数的函数
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
})