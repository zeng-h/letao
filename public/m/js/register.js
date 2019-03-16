$(function () {
  // 调用注册的函数
  getVcode();
  register();

  function register() {
    // 给注册按钮添加点击事件
    $('.register-btn').on('tap', function () {
      var hasValue = true;
      // 获取整个表单，进行非空验证
      var inputs = $('#main input');
      console.log(inputs);
      // 遍历所有的按钮
      inputs.forEach(function (ele, index) {
        // console.log(ele);
        // console.log(index);

        // 获取当前输入框的值
        var value = $(ele).val().trim();
        if (value == '') {
          mui.toast(ele.placeholder, {
            duration: 'long',
            type: 'div'
          });
          hasValue = false;
          return false;
        }
      })
      if (hasValue) {
        // 不为空，然后判断手机号，用户名密码等信息
        // 判断手机号
        var mobile = $('.mobile').val().trim();
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(mobile)) {
          mui.toast('手机号输入有误！', {
            duration: 'long',
            type: 'div'
          });
          return false;
        }
        // 判断用户名6-12
        var username = $('.username').val().trim();
        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(username)) {
          mui.toast('用户名输入有误，需6-12位！', {
            duration: 'long',
            type: 'div'
          });
          return false;
        }
        // 判断两次输入的密码是否相等
        var password = $('.password').val().trim();
        var confirmPassword = $('.confirmPassword').val().trim();
        if (password != confirmPassword) {
          mui.toast('两次输入的密码不一致', {
            duration: 'long',
            type: 'div'
          });
          return false;
        }
      }
      $.ajax({
        url: '/user/register',
        type: 'post',
        data: {
          username: username,
          password: password,
          mobile: mobile,
          vCode: vCode
        },
        success: function (res) {
          if (res.success) {
            location = 'login.html?returnURL=index.html';
          }
        }
      })
    })
  }
  var vCode = '';
  // 获取验证码的函数
  function getVcode() {
    var vcode = $('.vcode').val().trim();
    $.ajax({
      url: '/user/vCode',
      success: function (res) {
        vCode = res.vCode
        console.log(vCode);
      }
    });
    $('.get-vcode').on('tap', function () {
      if (vcode != vCode) {
        mui.toast('验证码输入有误', {
          duration: 'long',
          type: 'div'
        });
      }
    })
  }
});