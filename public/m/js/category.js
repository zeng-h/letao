$(function () {
  // 1. 发送ajax请求，获取数据渲染左侧列表
  $.ajax({
    url: '/category/queryTopCategory',
    success: function (data) {
      // console.log(data);
      var html = template('categoryLeftTpl', data);
      $('.left ul').html(html);
    }
  });

  // 4. 由于数据是由后台返回后渲染到页面上的，但是按照实际情况应该是页面一加载就要默认显示第一个的数据
  getCategoryRight(1);

  // 2. 点击左侧列表，根据id发送ajax请求，获取数据渲染右侧列表
  // 注册点击事件,因为是动态生成的li，所以用事件委托注册事件

  $('.left ul').on('tap', 'li', function () {

    // 给当前点击的li添加一个active类，其他兄弟元素移除这个类
    $(this).addClass('active').siblings().removeClass('active');
    // 获取id, 根据id发送请求右侧分类的数据
    // 这里使用了zepto里面的data方法，不仅可以获取数据还能自动转换数据类型
    var id = $(this).data('id');
    // console.log(id);
    getCategoryRight(id);
  });

  // 3. 初始化页面内容滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0006, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false, //是否显示滚动条
  });


  // 4. 将请求右侧数据的请求封装成一个函数，因为要多次使用
  // 又由于id不一样，所以id要当作参数传入
  function getCategoryRight(id) {
    $.ajax({
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      success: function (data) {
        // console.log(data);
        // 调用模板
        var html = template('categoryRightTpl', data);
        // 渲染到页面上
        $('.right .right-brand').html(html);
        // 如果没有数据 ，提示用户一句话
        if (data.rows.length == 0) {
          $('.right .right-brand').html('我真的实在是不能给到更多了/(ㄒoㄒ)/~~');
        }
      }
    })
  }

});