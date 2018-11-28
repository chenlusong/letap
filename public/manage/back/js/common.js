//引入了nprogress.js文件后，就有了一个全局对象NProgress对象
//开启进度条
// NProgress.start();
// //关闭进度条
// NProgress.done();

$( document ).ajaxStart(function(){
  NProgress.start();
})
$( document ).ajaxStop(function(){
  setTimeout(function(){
    NProgress.done();
  },1000);
  
});

// 公共的功能。
$(function(){
  // 1.左侧的二级菜单切换。
  $('.category').click(function(){
    $(this).next().stop().slideToggle();
  })

  // 2.左侧侧边栏切换。
  $('.icon_left').click(function(){
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
  })

  // 3.退出功能。
  // (1) 点击右侧按钮，显示模态框
  $('.icon_right').click(function(){
    // alert('66666');
    $('#logoutModal').modal("show");
  })
  // (2) 点击模态框的推出按钮，完成退出功能。
  $('#logoutBtn').click(function(){
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if(info.success){
          location.href = "login.html";
        }
      }
    });
  })

})