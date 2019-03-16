$(function () {

  login();

  // 1. 登录的函数
  function login() {
    $('.btn-login').on('tap', function () {
      // 获取输入的用户名和密码
      var username = $('.username').val().trim();
      var password = $('.password').val().trim();
      // 进行用户名和密码进行非空判断
      if (username == '') {
        mui.toast('请输入用户名', {
          duration: 'long',
          type: 'div'
        })
      }
      if (password == '') {
        mui.toast('请输入密码', {
          duration: 'long',
          type: 'div'
        })
      }
      // 请求登录接口
      $.ajax({
        type: 'post',
        url: '/user/login',
        data: {
          username: username,
          password: password
        },
        success: function (data) {
          if (data.error) {
            // 登录失败
            mui.toast(data.message, {
              duration: 'long',
              type: 'div'
            })
          } else {
            // 登录成功，返回商品详情页面,根据传过来的url获取参数
            // console.log(getQueryString('returnURL'));
            location = getQueryString('returnURL');
          }

        }
      });
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