// 搜索页面的逻辑代码
$(function () {

  addHistory();
  queryHistory();
  deleteHistory();
  clearHistory();
  // gotoSearchList();

  // 1. 添加记录函数
  function addHistory() {
    /* 
      添加记录的思路：
      1. 点击搜索添加记录 添加事件
      2. 获取当前输入内容 搜索的内容
      3. 判断如果当前输入内容 提示输入
      4. 把记录添加带本地存储
      5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
      6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加新的搜索的值
      7. 而且如果搜索内容重复还要对数组去重（把旧的值删掉再添加新的）新的数组往最前面添加
      8. 加完后把数组保存到本地存储中（转成json字符串）
    
    */
    //  给搜索按钮注册点击事件，使用zepto都使用tap事件 解决了点击事件的延迟
    $('.search-btn').on('tap', function () {
      // 去除输入内容左右两边的空格
      var searchText = $('.search>input').val().trim();
      // console.log(searchText);
      // 进行非空判断
      if (searchText == '') {
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
        if (searchHistory[i].key == searchText) {
          searchHistory.splice(i, 1);
          // 如果有多个重复的数据， 删掉一个值数组的长度就少了一个
          i--;
        }
      }
      // 往数组里面添加值，往前面添加
      searchHistory.unshift({
        key: searchText,
        time: new Date().getTime()
      });
      // 把数组转成json字符串存储到本地存储中
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      // 添加完成后调用查询数据，刷新数据
      queryHistory();
      // 清空输入框中的内容
      $('.search>input').val('');
      // 跳转到商品列表页面，并传入输入的内容和时间
      location = 'productlist.html?search=' + searchText + '&time=' + new Date().getTime();
    });
  }

  // 2. 查询记录函数
  function queryHistory() {
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
    // 调用模板
    var html = template('searchHistoryTpl', {
      list: searchHistory
    });
    // 把生成的html放到ul里面
    $('.history>ul').html(html);

  }

  // 3. 删除记录函数
  function deleteHistory() {
    // 由于历史记录是动态渲染的，所以要用委托注册
    $('.history ul').on('tap', '.btn-delete', function () {
      // 获取元素身上的index
      // var index=this.dataset['index'];
      var index = $(this).data('index');
      // console.log(index);
      // 获取本地存储中的数据
      var searchHistory = localStorage.getItem('searchHistory');
      // 转换成数组
      searchHistory = JSON.parse(searchHistory);
      // 在当前的数组中删除掉这个索引的值
      searchHistory.splice(index, 1);
      // 删除后再将数据保存到本地存储中
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      // 再调用查询来刷新列表
      queryHistory();
    });
  }

  // 4. 清空记录函数
  function clearHistory() {
    // 给清空按钮注册点击事件
    $('.btn-clear').on('tap', function () {
      localStorage.removeItem('searchHistory');
      // 再调用查询来刷新列表
      queryHistory();
    });
  }

  // 5. 点击搜索记录的li也能跳转到商品列表页面
  // function gotoSearchList() {
  //   // 用事件委托注册点击事件
  //   $('.history ul').on('tap', 'li', function () {
  //     // 获取当前li上面的搜索内容，绑定在元素的属性上
  //     var value = $(this).data('value');
  //     // console.log(value);
  //     // 根据搜索内容跳转到搜索列表页面
  //     location = 'productlist.html?search=' + value;
  //     // 由于点击xx按钮也会跳转，所以需要阻止

  //   });
  // }

});