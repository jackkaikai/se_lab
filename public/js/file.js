$(document).ready(function() {


	//下载
    $('.fileDownload').click(function(){
    	var url = $(this).attr("url");
    	var name = $(this).attr("name");
    	var id = $(this).attr("id");
    	download(url,name,id);
    })

    function download(url, name,id) {
        name = name || url
        // fetch抓取图片数据
        fetch(url).then(response=> {
            if( response.status == 200 )
                // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
                return response.blob()
            throw new Error(`status: ${response.status}.`)
        }).then(blob=> {
            // 获取到blob对象
            downloadFile(name, blob,id)
        }).catch(error=> {
            console.log("failed. cause:", error)
        })
    }

    // 点击图片即可下载
    function downloadFile(fileName, blob,id) {
        const anchor = document.getElementById(id);
        // 创建指向blob对象地址
        const src = URL.createObjectURL(blob)
        anchor.download = fileName
        anchor.href = src
    }


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
	        $('.ui.modal').modal('hide');
	        $('.menu .right.item').text(user);
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

                            setTimeout(function(){
                            	location.reload();
                            },1000);

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

                                        fd.append('dir','root');
                                        
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