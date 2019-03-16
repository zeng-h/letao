$(function () {
  $('.login-btn').on('click', function () {
    // 获取当前的用户名和密码
    var username = $('.username').val();
    var password = $('.password').val();
    // 发送请求
    $.ajax({
      url: '/employee/employeeLogin',
      type: 'post',
      data: {
        username: username,
        password: password
      },
      success: function (data) {
        if (data.error) {
          alert(data.message)
        } else {
          location = 'index.html';
        }

      }
    })
  })
})