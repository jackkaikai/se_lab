$(document).ready(function(){

//     var fd = new FormData(),
//         xhr = new XMLHttpRequest(),
//         input;


//  	$("#btn").click(function(){
//  		create_input();
//  		console.log('s');
//   	});


//   	function create_input(){
// 		input = document.createElement('input');
//         input.setAttribute('id', 'myUploadInput');
//         input.setAttribute('type', 'file');
//         input.setAttribute('name', 'file');
//         input.setAttribute('multiple', true);
//         $("body").append(input);
//         input.style.display = 'none';
//         input.click();

//         input.onchange = function() {
// 	    	if(input.files.length == 0) { return false; }
// 	        for(var i = 0; i < input.files.length; i++) {
// 	        	var file = input.files[i];
// 	        	var type = file.name.split('.').pop();
// 	            fd.append('file' + i, file);
// 	        }
//         }
//   	}



// });

/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */

            note = document.getElementById("note"),
            prs = document.getElementById("process");


	    $("#pickfiles").click(function(){
            myUpload({
                url: '/upload',
                maxSize: 10,
                multiple: true,
                beforeSend: function(file) {
                    note.innerText = "开始上传...";
                },
                callback: function(res, input) {
                    res = JSON.parse(res);
                    if(res.code == 1) {
                        note.innerText = "上传成功!"
                    } else {
                    	note.innerText = res.msg;
                    }
                    document.body.removeChild(input);
                },
                uploading: function(pre) {
                    prs.innerText = "当前上传进度为：" + pre + "%";
                }
            });
        })


 
        function myUpload(option) {
            var fd = new FormData(),
                xhr = new XMLHttpRequest(),
                input;
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
            var fileType = ['jpg','png'];
            input.onchange = function() {
            	if(input.files.length == 0) { return false; }
                for(var i = 0; i < input.files.length; i++) {
                	var file = input.files[i];
                	var type = file.name.split('.').pop();
                 //    if(option.maxSize &&  file.size > option.maxSize * 1024 * 1024){
                 //        alert('请上传小于' + option.maxSize + 'M的文件');
                 //        document.body.removeChild(input);
                 //        return false;
                 //    }
                 //    if(fileType.indexOf(type.toLocaleLowerCase()) == -1) {
	                //     alert("暂不支持该类型的文件，请重新选择!");
	                //     document.body.removeChild(input);
	                //     return false;
	                // }
	                // console.log(fd)
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
                    	document.body.removeChild(input);
                        console.log("上传失败！");

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


	$.get("ok",function(res){
		var items  = res.items;
		console.log(items);

		prefix = '/look';

		items.forEach(function(item) {
          	// console.log(item.key);
          	var file_name = item.key.slice(prefix.length);
          	var timestamp = item.putTime;
          	timestamp = timestamp.toString().slice(0,10);
          	console.log(timestamp);
          	var file_time = new Date(timestamp*1000).toLocaleString();
			$('#concrete-files').append(' <div class="ui card"><div class="content"><a href="" class="”header“">'+prefix+'</a><div class="meta"><span>'+file_time+'</span></div><div class="description">'+file_name+'</div></div>');
		})
	})
});




