>## 软件工程大型实验
>文件上传管理功能


## 前端 

- UI -> `Semantic-ui`

- 通过 `FormData` 对文件进行 **包装传递** 
    - https://www.tuicool.com/articles/RZBJBv
 
## 后端

- 框架 ->  `experss.js`
- 七牛文件存储功能
    - `upload`
    - `listfile` 

## 关于七牛

- `bucket` => 实验中统一放在 `file-update-tool`中
- `key`  =>  文件名
- `prefix` =>  可作为文件夹的管理
- 文件下载 =>  `url = <bucket-domain> + key`
- 上传 token => 需要 accessKey 和 secretKey 进行哈希，此处采用线上生成，有效期 *12Hour*
    - http://jsfiddle.net/gh/get/extjs/4.2/icattlecoder/jsfiddle/tree/master/uptoken 

## 运行

```
npm install
npm start

#开发环境下
nodemon ./app.js localhost 3000
```

##  Docker 部署 

- centos 安装 docker 

```
yum -y install docker
service docker start
```

- Git 下载

```
git clone https://github.com/AgeBing/se_lab
```

- 构建镜像
     
```
docker build -t  se-app .
```
   
    
- 运行容器
    
```
docker run -i  -p 3019:3019 se-app
```

    
- 参考
    - https://itbilu.com/linux/docker/V1Y3XjmoG.html  
     
     
##  运行
http://115.159.202.238:3019/


