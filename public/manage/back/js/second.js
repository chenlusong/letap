$(function(){
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数


  // 1. 一进入页面, 发送ajax请求, 请求列表数据, 进行渲染(通过模板引擎)
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType : "json",
      success: function( info ) {
        console.log( info );
        // template(模板id, 数据对象), 在模板中可以任意使用传进去对象中的所有属性
        var htmlStr = template("secondTpl", info)
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

  $('#addBtn').click(function() {
    $('#addModal').modal("show");
    // 发送请求，获取一级下拉列表的所有数据。
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function ( info ) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html( htmlStr );
      }
    });
  });


  // 3.给下拉列表的a通过事件委托添加点击事件
  $('.dropdown-menu').on("click",'a',function(){
    var txt = $(this).text();
    $('#dropdownText').text( txt );
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })


  // 4.配置上传的插件。让插件上传异步请求。
  $("#fileupload").fileupload({
    dataType:"json",
    done:function (e, data) {
      // console.log(data);
      var picObj = data.result;
      var picUrl = picObj.picAddr;
      $('#imgBox img').attr("src",picUrl);
      $('[name="brandLogo"]').val( picUrl );
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  // 5.添加表单效验功能。
  $('form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });


  // 6.注册表单信息时，阻止表单默认提交，使用ajax提交。
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        if( info.success ){
          $('#addModal').modal('hide');
          currentPage = 1;
          render();
          $('#form').data("bootstrapValidator").resetForm(true);
          $('#dropdownText').text("请选择一级分类");
          $('#imgBox img').attr("src","./images/none.png");
        }
      }
    });
  });
})
