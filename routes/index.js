var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

const multiparty = require('connect-multiparty');
const path = require('path');
let uploadDir = path.resolve(__dirname, '../temp');
let multipartMiddleware = multiparty({uploadDir});
 

router.get('/ok',function(req, res, next){

    var accessKey = 'Zvf1stktGElAF_n4TKRduaPoTPfm4rt2WzTaR49K';
    var secretKey = 'jPXP-8AAayQBFL-KXUQibb_mkdjVCQebQcrc0Wfp';
    var qiniu = require("qiniu");

    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z0;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    var bucket = "file-update-tool";
    var key = "app.zip";

    var bucket_url = 'http://p2h9efhxp.bkt.clouddn.com/';
    var options = {
      limit: 10,
      prefix: 'look/',
    };

    // bucketManager.stat(bucket, key, function(err, respBody, respInfo) {
    //     console.log('开始文件');
    //   if (err) {
    //     console.log(err);
    //     //throw err;
    //   } else {
    //     if (respInfo.statusCode == 200) {
    //       console.log(respBody.hash);
    //       console.log(respBody.fsize);
    //       console.log(respBody.mimeType);
    //       console.log(respBody.putTime);
    //       console.log(respBody.type);
    //     } else {
    //       console.log(respInfo.statusCode);
    //       console.log(respBody.error);
    //     }
    //   }
    // });

    bucketManager.listPrefix(bucket, options, function(err, respBody, respInfo) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (respInfo.statusCode == 200) {
        console.log('有');
        //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
        //指定options里面的marker为这个值
        var nextMarker = respBody.marker;
        var commonPrefixes = respBody.commonPrefixes;
        console.log(nextMarker);
        console.log(commonPrefixes);
        var items = respBody.items;
        items.forEach(function(item) {
          console.log(item.key);
          item.url = bucket_url + item.key;
          console.log(item.putTime);
          // console.log(item.hash);
          // console.log(item.fsize);
          // console.log(item.mimeType);
          // console.log(item.endUser);
          // console.log(item.type);
        });

        res.json({items:items});
        // res.json({ titl: 'Exps' });
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }

    });

})

router.post('/upload', multipartMiddleware, function(req, res, next) {

    console.log('文件'+req.files);
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
    function uploadFile(uptoken, key, localFile, resolve, reject) {
        var config = new qiniu.conf.Config();
        // 空间对应的机房
        config.zone = qiniu.zone.Zone_z0;
        var formUploader = new qiniu.form_up.FormUploader(config);
        let extra = new qiniu.form_up.PutExtra();
        formUploader.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                resolve(localFile);
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
            key = req.files[index].originalFilename;
             key = prefix + key;
            //生成上传 Token
            token = uptoken(bucket, key);
      
            //要上传文件的本地路径
            filePath = req.files[index].path;
     
            //调用uploadFile上传
            uploadFile(token, key, filePath, resolve, reject);
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

module.exports = router;