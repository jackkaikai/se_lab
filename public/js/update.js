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

        $('#login-button').click(function () {
            var user = $("#user").val();
            console.log('hi there :' + user);
            $('.ui.modal')
                .modal('hide')
            ;
            $('.menu .right.item').text(user);
        });


        //返回首页
        $('.reply.icon').click(function () {
            $('.ui.cards').empty();
            console.log('return');
            $('#path').text('/');
            $.get('listdir',function (res) {
                var dirs = res.dirs;
                dirs.forEach(function (value) {
                    append_dir(value.file_dir);
                });
                $('.path-enter').click(function () {
                    console.log(1);
                    var dir = $(this).parents('.card').attr("id");
                    console.log(dir);
                    $('#path').text('/'+dir);
                    $('.ui.cards').empty();
                    $.get('listfile',{dir:dir},function (res) {
                        var files = res.files;
                        // console.log("res.files"+res);
                        files.forEach(function (file) {
                            file.file_Name = file.fileName;
                            file.file_url = file.URL;
                            file.file_time = file.file_upTime;
                            append_file(file);
                        });
                    });
                });
            });
        });

        //点击进入文件夹


        function  append_dir(file_dir) {
            // $('.ui.cards').empty();
            var elem = "<div class=\'ui card type-directory\' id="+file_dir+"><div class=\'content\'><a class='”header“'>"+file_dir+"</a></div><div class='extra content'><button class='path-enter' ><span class='right floated'><i class='sign in icon'></i>进入</span></button></div></div>";
            $('.ui.cards').append(elem);

        }
        function append_file(file) {
            var elem = "<div class=\"ui card type-file\" ><div class=\"content\"><a href=\"\" class=\"”header“\">file.file_dir</a><div class=\"meta\"><span>file.file_time</span></div><div class=\"description\">"+file.file_Name+"</div></div><div class=\"extra content\"><a href="+file.file_url+"><span class=\"right floated\"><i class=\"download icon\"></i>下载</span></a></div></div>";
            $('.ui.cards').append(elem);
        }

        //首页进入
        $.get('listdir',function (res) {
            var dirs = res.dirs;
            dirs.forEach(function (value) {
                append_dir(value.file_dir);
            });

            $('.path-enter').click(function () {
                console.log(1);
                var dir = $(this).parents('.card').attr("id");
                console.log(dir);
                $('#path').text('/'+dir);
                $('.ui.cards').empty();
                $.get('listfile',{dir:dir},function (res) {
                    var files = res.files;
                    // console.log("res.files"+res);
                    files.forEach(function (file) {
                        file.file_Name = file.fileName;
                        file.file_url = file.URL;
                        file.file_time = file.file_upTime;
                        append_file(file);
                    });
                });
            });
        });

        //文件上传
        var input;
        var path;

	    $("#pickfiles").click(function(){
            myUpload({
                url: '/upload',
                maxSize: 10,
                multiple: true,
                beforeSend: function(file) {
                    $('#file_example .label').text("上传中");
                },
                callback: function(res, input) {
                    res = JSON.parse(res);
                    if(res.code == 1) {
                        $('#file_example .label').text("上传成功!");
                        $('#file_example .ui.progress').addClass('success');

                    } else {
                        $('#file_example .label').text("上传失败!");
                        $('#file_example .ui.progress').addClass('error'); 
                    }
                    document.body.removeChild(input);
                },
                uploading: function(pre) {
                        $('#file_example .ui.progress').progress({
                          percent: pre
                        });
                    }
            });
        })

        function myUpload(option) {
            var fd = new FormData(),
                xhr = new XMLHttpRequest(),
            input = document.createElement('input');
            input.setAttribute('id', 'myUploadInput');
            input.setAttribute('type', 'file');
            input.setAttribute('name', 'file');
            if(option.multiple) {
                input.setAttribute('multiple', true);
            }
            document.body.appendChild(input);
            input.style.display = 'none';
            input.click();
            input.onchange = function() {
            	if(input.files.length == 0) { return false; }
                for(var i = 0; i < input.files.length; i++) {
                	var file = input.files[i];
                	var type = file.name.split('.').pop();
                    fd.append('file' + i, file);
                }
                if(option.beforeSend instanceof Function) {
                    if(option.beforeSend(input) === false) {
                    	document.body.removeChild(input);
                        return false;
                    }
                }
                xhr.open('post', option.url);
                xhr.onreadystatechange = function() {
                    if(xhr.status == 200){
                        if(xhr.readyState == 4) {
                            if(option.callback instanceof Function) {
                                option.callback(xhr.responseText, input);
                            }
                        }
                    } else {
                        $('#file_example .label').text("上传失败!");
                    }
                }
                xhr.upload.onprogress = function(event) {
                    var pre = Math.floor(100 * event.loaded / event.total);
                    if(option.uploading instanceof Function) {
                        option.uploading(pre);
                    }
                }
                xhr.send(fd);
            }
        }


});




