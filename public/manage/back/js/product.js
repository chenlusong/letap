$(function(){
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数

  var picArr = [];   // 用于存储图片的地址。
  // 1. 一进入页面, 发送ajax请求, 请求列表数据, 进行渲染(通过模板引擎)
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType : "json",
      success: function( info ) {
        console.log( info );
        // template(模板id, 数据对象), 在模板中可以任意使用传进去对象中的所有属性
        var htmlStr = template("productTpl", info)
        $('tbody').html( htmlStr );
        // 在ajax请求回来后, 根据最新的数据, 进行初始化分页插件
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, // 版本号
          currentPage: info.page, // 当前页
          totalPages: Math.ceil( info.total / info.size ), // 总页数
          // 给页码添加点击事件
          onPageClicked: function( a, b, c, page ) {
            currentPage = page;
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
      url: "/category/querySecondCategoryPaging",
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
    $('[name="brandId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  })


  // 4.配置上传的插件。让插件上传异步请求。
  $("#fileupload").fileupload({
    dataType:"json",
    done:function (e, data) {
      // console.log(data);
      var picObj = data.result;
      picArr.unshift( picObj );
      var picUrl = picObj.picAddr;
      $('#imgBox').prepend('<img src="'+ picUrl +'" style="width: 100px;">');
      if( picArr.length > 3 ){
        picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      if( picArr.length === 3 ){
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
    }
  });

  // 5.添加表单效验功能。
  $('#form').bootstrapValidator({
    // 重置排除项, 都校验, 不排除
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 xx-xx格式, xx为两位数字, 例如 36-44'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });


  // // 6.注册表单信息时，阻止表单默认提交，使用ajax提交。
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    var paramsStr = $('#form').serialize();
    // 拼接数据。
    paramsStr += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName1="+ picArr[1].picName +"&picAddr1=" + picArr[1].picAddr;
    paramsStr += "&picName1="+ picArr[2].picName +"&picAddr1=" + picArr[2].picAddr;
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        if( info.success ){
          $('#addModal').modal('hide');
          currentPage = 1;
          render();
          $('#form').data("bootstrapValidator").resetForm(true);
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    });
  });



})
