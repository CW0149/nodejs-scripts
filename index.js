const { argv } = require('process')
const path = require('path')
const { exec } = require('child_process')

const [binPath, execPath, scriptName, ...scriptArgs] = argv

if (!scriptName) {
	return console.log('无效的脚本名')
}


// 方法一 命令行执行
// const scriptPath = `${__dirname}/${scriptName}.js`
// exec(`node ${scriptPath} ${scriptArgs.join(' ')}`, (error, stdout, stderr) => {
// 	console.log(error, stdout, stderr)
// })

// 方法二 引入

const createDir = require('./createDir.js')

const commandMap = { // 存储所有指令对应的脚本
	createDir
}

commandMap[scriptName](...scriptArgs)

