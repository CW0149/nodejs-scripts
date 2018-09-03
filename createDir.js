// 包含两个函数，一个用于生成文件夹及文件，一个用于清除文件
// 命令行传的第一个参数为执行操作的根路径
const fs = require('fs')
const path = require('path')
const process = require('process')
const child_process = require('child_process')

const data = require('./config').createDirConfig

// 接受命令行传参 config配置, 默认当前路径
const baseDir = process.argv[2] || data.path || __dirname
let bookRootDir = path.resolve(baseDir, data.rootDirName)

function mkdir(path) {
	console.log('mkdir', path)
	try {
		fs.mkdir(path, () => {})
	} catch (e) {}
}

function mkdirSync(path) {
	console.log('mkdirSync', path)
	try {
		fs.mkdirSync(path)
	} catch (e) {
		// console.log(e)
	}
}

function isArrayEmpty(arr) {
	if (!Array.isArray(arr) || !arr.length) return true
	return false
}

function mkdirAndFielsForObj(obj, props) {
	obj.path = `${props.path}/${obj.name}`

	// 处理commonFiles
	if (!isArrayEmpty(props.commonFiles)) {
		obj.files = obj.files ? [...props.commonFiles, ...obj.files] : props.commonFiles
	}


	const filesEmpty = isArrayEmpty(obj.files)
	const subEmpty = isArrayEmpty(obj.sub)
	if (filesEmpty && subEmpty) {
		return mkdir(obj.path, () => {}) // zero success -1 failed
	}

	try {
		let status = true
		status = mkdirSync(obj.path) && status
		if (!filesEmpty) {
			for (let name of obj.files) {
				const nameArr = name.split('.')
				const title = `# ${nameArr[0]}` || ''
				const filePath = `${obj.path}/${name}`
				console.log(`writeFile ${filePath}`)
				status = fs.writeFile(filePath, title, () => {}) && status
			}
		}

		if (!subEmpty) {
			for (let item of obj.sub) {
				const { path, commonFiles } = obj
				status = mkdirAndFielsForObj(item, { path, commonFiles }) && status
			}
		}

		return status ? 0 : -1
	} catch (err) {
		return -1
	}
}

function clean(baseDir) {
	bookRootDir = path.resolve(baseDir, data.rootDirName) || bookRootDir
	try {
		fs.statSync(bookRootDir)
		child_process.exec(`rm -rf ${bookRootDir}`, (error, stdout, stderr) => {
      if (error) {
        console.log(error.stack)
        console.log('Error code: '+error.code)
        console.log('Signal received: '+error.signal)
      }
    })
	} catch (e) {
		// console.log(e)
	}
}

function createBookDirs(baseDir) {
	bookRootDir = path.resolve(baseDir, data.rootDirName) || bookRootDir
	try {
		fs.statSync(bookRootDir)
	} catch (e) {
		mkdirSync(bookRootDir)
	}
	const { routes, commonFiles } = data

	mkdirSync(bookRootDir)

	routes.forEach((obj) => {
		mkdirAndFielsForObj(obj, { path: bookRootDir, commonFiles })
	})
}



// createBookDirs()
// clean()

module.exports = (command, ...options) => {
	switch(command) {
		case 'create':
			createBookDirs(...options)
			break
		case 'clean':
			clean(...options)
			break
		default:
			console.log(`createDir脚本不存在${command}指令`)
	}
}