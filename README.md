# 常用脚本文件

## 文件功能

* config.js是所有脚本的配置项目

### createDir.js
* 可以根据config.js里面的createDirConfig生成对应的目录和文件树
* 支持清空生成的文件
* 定义生成的文件夹所处位置优先级：命令行传参数(第一个参数) > createDirConfig.path > 默认的createDir.js文件所在目录
* [配置示例](./static/images/createDirConfig.png)
* [结果示例](./static/images/createDirResult.png)

### treeDir.js
* 生成目录结构，结果保存在dirTree.json
* 接受命令行参数，第一个参数为要打印的文件夹路径
* [结果示例](./static/images/dirTreeResult.png
)