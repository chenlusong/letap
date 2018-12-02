$(function () {
  var currentPage = 1; // 当前页，每页条数。
  var pageSize = 5; // 每页条数。

  
  var currentId; // 当前的id
  var isDelete; // 修改的状态。
  rander();
  
  function rander() {
    // 1.一进页面，发送ajax请求。渲染列表。
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("tmp", info);
        $('tbody').html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            // console.log(page);
            currentPage = page;
            rander();
          }
        });
      }
    });
  }

  // 2.给所有的按钮添加点击事件，通过事件委托。
  //     给动态生成元素绑定事件。
  //     一次设置多次事件
  

  $('tbody').on('click','.btn',function(){
    //  显示模态框。
    $('#userModal').modal("show");
    currentId = $(this).parent().data("id");
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    console.log(currentId);
  });
//   // 模态框确认按钮被点击的时候，发送ajax请求，修改状态。
  $('#confirmBtn').click(function(){
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id : currentId,
        isDelete : isDelete
      },
      dataType: "json",
      success: function (info) {
        if ( info.success ){
          $('#userModal').modal('hide');
          rander();
        }
      }
    });
  })
})