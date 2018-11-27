$(function() {
  /**
   * 1.进行表单效验配置
   *    效验要求：
   *      (1) 用户名不能为空，长度为2-6位
   *      (2) 密码不能为空，长度为6-12位
   */
  $('#form').bootstrapValidator({
    // 1.指定的图标。
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 2.配置效验字段。
    fields: {
      //校验用户名，对应input表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在6到30之间'
          },
          
        }
      },
      // 效验密码
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户名长度必须在6到30之间'
          },
        }
      }
    }  
  });

  /*
    2.效验成功后，会触发一个事件，表单效验成功事件
      默认是会提交表单的，页面就跳转了，
      我们需要注册表单效验成功事件，在成功事件中，阻止默认提交，通过ajax的提交，通过ajax提交  
  */
  $('#form').on('success.form.bv',function( e ){
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info)
        if(info.error === 1000){
          alert("用户名不存在");
          return;
        }
        if (info.error === 1001) {
          alert("密码错误");
          return;
        }
        if(info.success) {
          // 登陆成功。
          location.href = "index.html";
        }
      }
    });
  })

  // 3.重置功能，本身重置按钮，就可以重置内容，需要额外的重置状态。
  $('[type="reset"]').click(function(){
    $('#form').data("bootstrapValidator").resetForm();
  })


})