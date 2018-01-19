var express = require('express');
var router = express.Router();
var file_des="1";// 文件描述
var file_user="1";//文件上传用户
var url="http://p2h9efhxp.bkt.clouddn.com/";
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home.html');
});

const multiparty = require('connect-multiparty');
const path = require('path');
let uploadDir = path.resolve(__dirname, '../temp');
let multipartMiddleware = multiparty({uploadDir});

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '115.159.202.238',
    user     : 'file_root',
    password : '123456',
    database : 'file-up'
});


router.get('/home',function(req, res, next){
    var  sql = 'SELECT distinct file_dir FROM file_information';

    //查
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');

        var dir_url = 'listfile?dir='  
        result.forEach(function(item) {
            item.url = dir_url+item.file_dir;
        });

        res.render('home.html',{dirs:result});
    });



});

router.get('/listfile',function(req, res, next){
    var pretix = req.query.dir;
    var  sql = 'SELECT * FROM file_information where file_dir = ?';

    //查
    connection.query(sql,pretix,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        // res.json({dirs:result});
        result.forEach(function(item) {
            item.URL=url+item.fileID
            item.detail_url = 'detail?id='+item.fileID;
        });

        res.render('file.html',{files:result,this_dir:pretix});
    });

});

router.get('/detail',function(req, res, next){
    var id = req.query.id;
    res.render('detail.html',{id:id});
});


router.post('/upload', multipartMiddleware, function(req, res, next) {



    const qiniu = require("qiniu");

    //需要填写你的 Access Key 和 Secret Key
    accessKey = 'Zvf1stktGElAF_n4TKRduaPoTPfm4rt2WzTaR49K';
    secretKey = 'jPXP-8AAayQBFL-KXUQibb_mkdjVCQebQcrc0Wfp';

    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    //要上传的空间
    bucket = 'file-update-tool';

    //构建上传策略函数
    function uptoken(bucket, key) {
        // var prefix = 'look/';
        // key = prefix + key;
        // console.log(key);
        var options = {
            scope: bucket + ":" + key
        }
        let putPolicy = new qiniu.rs.PutPolicy(options);
        return putPolicy.uploadToken(mac);
    }
    //构造上传函数
    function uploadFile(uptoken, key, localFile, resolve, reject,index) {
        var config = new qiniu.conf.Config();
        // 空间对应的机房
        config.zone = qiniu.zone.Zone_z0;
        var formUploader = new qiniu.form_up.FormUploader(config);
        let extra = new qiniu.form_up.PutExtra();
        formUploader.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                resolve(localFile);
                var file_name=req.files[index].originalFilename;
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                // console.log(year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second);
                var file_time=year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;
                console.log(file_time);
                console.log("file_name"+file_name);
                // connection.connect();
                var prefix='look';
                var  addsql = 'INSERT INTO file_information(fileID,fileName,fileDes,fileUser,file_dir,file_upTime) VALUES(?,?,?,?,?,?)';
                //查
                var addparams=[key,file_name,file_des,file_user,prefix,file_time]
                connection.query(addsql,addparams,function (err, result) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }
                    console.log('--------------------------INSERT----------------------------');
                    console.log('INSERT ID:',result);
                    console.log('-----------------------------------------------------------------\n\n');
                });

            } else {
                // 上传失败， 处理返回代码
                reject(err);
            }
        });
    }

    // 构造Promise数组
    let promiseArr = [];
    for (index in req.files) {
        let p = new Promise((resolve, reject) => {
            var prefix = 'look/';

        //上传到七牛后保存的文件名

        key = Math.ceil(Math.random()*1000);
        // key = prefix + key;
        //生成上传 Token
        token = uptoken(bucket, key);

        //要上传文件的本地路径
        filePath = req.files[index].path;

        //调用uploadFile上传
        uploadFile(token, key, filePath, resolve, reject,index);
    })

        promiseArr.push(p);
    }

    // 所有异步执行完成之后返回成功
        let pAll = Promise.all(promiseArr);
        pAll.then((localFile) => {
            console.log(localFile);
        res.json({code: 1})
    }, (err) => {
            console.log(err);
            res.json({code: 0, msg: '上传失败'});
        })
    });

    router.get('/detail',function(req, res, next){
        var file_id = req.query.id;
        res.render('detail.html',{id:file_id});
    });

module.exports = router;