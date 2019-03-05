const fs = require('fs')
const path = require('path')

function createDirObj(dirName) {
	return {
		name: dirName,
		dir: [],
		files: []
	}
}


function init(baseDir) {
	const { treeDirConfig } = require('./config') // 设置了忽略的文件
	console.log('打印路径文件夹为： ', path.resolve(baseDir))

	const ignoredPaths = treeDirConfig.ignore || []

	return [baseDir, ignoredPaths]
}

function treeDir(_path, ignoredPaths, _box) {
	const dirFiles = fs.readdirSync(_path)
	for (let filename of dirFiles) {
		const filePath = path.resolve(_path, filename)
		let ignored = false
		for (let reg of ignoredPaths) {
			if (new RegExp(reg).test(filename)) {
				ignored = true
				break
			}
		}
		if (ignored) continue

		if (fs.statSync(filePath).isDirectory()) {
			const chidDir = createDirObj(filename)
			_box.dir.push(chidDir)
			treeDir(filePath, ignoredPaths, chidDir)
		} else {
			_box.files.push(filename)
		}
	}
}

function run(cmdPath, baseDir = cmdPath) {
	const result = createDirObj(path.basename(path.resolve(baseDir)))

	treeDir(...init(baseDir), result)
	fs.writeFileSync('./dirTree.json', JSON.stringify(result, null, 2))
}

module.exports = run


