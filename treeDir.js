const fs = require('fs')
const path = require('path')
const { argv } = require('process')

const { treeDirConfig } = require('./config') // 设置了忽略的文件

const [binPath, fileDirPath, ...leftArgv] = argv

// const baseDir = leftArgv[0] ? path.resolve(leftArgv)
let baseDir = ''
try {
	baseDir = leftArgv[0] ? path.resolve(leftArgv[0]) : __dirname
} catch (err) {
	baseDir = __dirname
	console.log(err)
	console.log('使用默认路径__dirname')
}

console.log('打印路径文件夹为： ', baseDir)

const ignoredPaths = {}
treeDirConfig.ignore.forEach((item) => {
	ignoredPaths[path.resolve(baseDir, item)] = true
})

const result = createDirObj('root')

function treeDir(_path, _box) {
	const dirFiles = fs.readdirSync(_path)
	for (let filename of dirFiles) {
		const filePath = path.resolve(_path, filename)

		if (ignoredPaths[filePath]) continue

		if (fs.statSync(filePath).isDirectory()) {
			const chidDir = createDirObj(filename)
			console.log(_box, _box.dir)
			_box.dir.push(chidDir)
			treeDir(filePath, chidDir)
		} else {
			_box.files.push(filename)
		}
	}
}

function createDirObj(dirName) {
	return {
		name: dirName,
		dir: [],
		files: []
	}
}

function run() {
	treeDir(baseDir, result)
	fs.writeFileSync('./dirTree.json', JSON.stringify(result, null, 2))
}

run()

module.exports = { run }


