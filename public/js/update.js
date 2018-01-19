$(document).ready(function(){



        //进度条
        $('#file_example .ui.progress')
          .progress({
            duration : 100,
            total    : 100
        });


        //登录
        $('.menu .right.item').click(function () {
            $('.ui.modal')
                .modal('show')
            ;
        });


        $('.menu .right.item').click(function () {
            $('.ui.modal')
                .modal('show')
            ;
        });

        $('#login-button').click(function () {
            var user = $("#user").val();
            console.log('hi there :' + user);
            $('.ui.modal')
                .modal('hide')
            ;
            $('.menu .right.item').text(user);
        });







});




