$(function(){
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数


  // 1. 一进入页面, 发送ajax请求, 请求列表数据, 进行渲染(通过模板引擎)
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function( info ) {
        console.log( info );
        // template(模板id, 数据对象), 在模板中可以任意使用传进去对象中的所有属性
        var htmlStr = template("firstTpl", info)
        $('tbody').html( htmlStr );
        // 在ajax请求回来后, 根据最新的数据, 进行初始化分页插件
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, // 版本号
          currentPage: info.page, // 当前页
          totalPages: Math.ceil( info.total / info.size ), // 总页数
          // 给页码添加点击事件
          onPageClicked: function( a, b, c, page ) {
            console.log( page );
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        });
      }
    });
  }


  // 2. 给所有的按钮, 添加点击事件(通过事件委托)
  //    事件委托的两大好处:
  //    (1) 可以给动态生成的元素, 绑定事件
  //    (2) 可以批量注册事件, 性能效率高

  $('#addBtn').click(function() {
    $('#addModal').modal("show");
  });


  // 3.通过表单效验，添加效验功能。
  $('#form').bootstrapValidator({

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 校验字段
    fields: {    // input框中需要配置 name
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });


  // 4. 注册表单校验成功事件, 阻止默认的提交, 通过  ajax 提交
  $('#form').on("success.form.bv", function( e ) {
    e.preventDefault(); // 阻止默认的提交

    // 通过ajax提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function( info ) {
        if ( info.success ) {
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重新渲染页面, 渲染第一页
          currentPage = 1;
          render();
          // 重置表单的内容 和 状态
          // resetForm( true ); 表示内容和状态都重置
          // resetForm();   表示只重置状态
          $('#form').data("bootstrapValidator").resetForm(true)
        }
      }
    })
  })


})
