# 常用脚本文件

node 6.x版本以上运行。

## 文件功能

* config.js是所有脚本的配置项目

### createDir.js

根据配置生成文件夹和文件

* 可以根据 config.js 里面的 createDirConfig 生成对应的目录和文件树
* 支持清空生成的文件
* 定义生成的文件夹所处位置优先级：命令行传参数(第一个参数) > createDirConfig.path > 默认的createDir.js文件所在目录
* [配置示例](./static/images/createDirConfig.png)
* [结果示例](./static/images/createDirResult.png)

```
node ./ createDir create // 默认当前路径生成config中配置的目录结构
node ./ createDir  clean // 默认清除当前位置book文件夹
node ./ createDir create [path] // path.resolve(process.cwd(), path)生成config中配置的目录结构
node ./ createDir clean [path] // 清除path.resolve(process.cwd(), path)book文件夹
```

### treeDir.js

生成文件夹目录树结构

* 生成目录结构，结果保存在命令行路径的dirTree.json
* 接受命令行参数，第一个参数为要打印的文件夹路径
* config.js 中的 treeDirConfig 可配置目录树中忽略的文件夹和文件
* [结果示例](./static/images/dirTreeResult.png)

```
node ./ treeDir // 默认当前路径
node  ./ treeDir [path] // path.resolve(process.cwd(), path)
```

### createServer.js

启动一个nodejs http服务，返回index.html

* 启动一个nodejs服务，返回当前文件夹index.html
* 接受一个表示端口号的命令行参数

```
node ./ createServer 8002 // 在8002端口启动， 默认8001
```