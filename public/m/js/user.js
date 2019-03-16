$(function () {
  queryUaerInfor();
  logout();

  // 查询个人信息函数
  function queryUaerInfor() {
    $.ajax({
      url: '/user/queryUserMessage',
      success: function (res) {
        console.log(res);
        if (res.error) {
          // 说明没有登录，跳转到登录页面
          location = 'login.html?returnURL=' + location.href;
        } else {
          // 已经登录，将用户名和手机号渲染到页面上
          $('.username').html(res.username);
          $('.phonenum').html(res.mobile);
        }
      }
    })
  }

  // 退出登录
  function logout() {
    $('.logout').on('tap', function () {
      //  退出登录，跳转到登录页面
      $.ajax({
        url: '/user/logout',
        success: function (res) {
          // console.log(res);
          if (res.success) {
            location = 'login.html?returnURL=' + location.href;
          }

        }
      })
    });
  }
});