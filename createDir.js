// 包含两个函数，一个用于生成文件夹及文件，一个用于清除文件
// 命令行传的第一个参数为执行操作的根路径

const fs = require('fs')
const path = require('path')
const process = require('process')
const child_process = require('child_process')

function mkdir(path) {
	console.log('mkdir', path)
	try {
		fs.mkdir(path, () => {})
		return true
	} catch (e) {return false}
}

function mkdirSync(path) {
	console.log('mkdirSync', path)
	try {
		fs.mkdirSync(path)
		return true
	} catch (e) {return false}
}

function isArrayEmpty(arr) {
	if (!Array.isArray(arr) || !arr.length) return true
	return false
}


/**
 * 路径是否存在
 * @param {string} dir 路径
 * @param {boolean} create 路径不存在时是否创建
 */
function dirExists(dir, create){
	try {
  	let isExists = fs.statSync(dir)
  	if(isExists.isDirectory()) {
  	    return true
  	} else if (isExists) {
  	    console.log(`${dir}不是文件夹`)
  	    return false
  	}
	} catch(err) {
		if (create) {
			let tempDir = path.parse(dir).dir      //拿到上级路径
			let status = dirExists(tempDir, true)
			let mkdirStatus
			if(status){
			    mkdirStatus = mkdirSync(dir)
			}
	  	return mkdirStatus
		} else {
			console.log(`不存在文件夹${dir}`)
			return false
		}
	}
}

function mkdirAndFielsForObj(obj, props) {
	obj.path = `${props.path}/${obj.name}`

	// 处理commonFiles
	if (!isArrayEmpty(props.commonFiles)) {
		obj.files = obj.files ? [...props.commonFiles, ...obj.files] : props.commonFiles
	}


	const filesEmpty = isArrayEmpty(obj.files)
	const subEmpty = isArrayEmpty(obj.dir)
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
			for (let item of obj.dir) {
				const { path, commonFiles } = obj
				status = mkdirAndFielsForObj(item, { path, commonFiles }) && status
			}
		}

		return status ? 0 : -1
	} catch (err) {
		return -1
	}
}

function clean(bookRootDir) {
	const pathExists = fs.existsSync(bookRootDir)
	if (pathExists) {
			child_process.exec(`rm -rf ${bookRootDir}`, (error, stdout, stderr) => {
				console.log(`${bookRootDir} cleaned`)
	      if (error) {
	        console.log(error.stack)
	        console.log('Error code: '+error.code)
	        console.log('Signal received: '+error.signal)
	      }
	    })
	} else {
		console.log(`no folder ${bookRootDir}`)
	}
}

function createBookDirs(bookRootDir, configData) {
	mkdirSync(bookRootDir)
	if (!dirExists(bookRootDir)) return console.log('生成失败')

	const { routes, commonFiles } = configData

	routes.forEach((obj) => {
		mkdirAndFielsForObj(obj, { path: bookRootDir, commonFiles })
	})
}

function getRootDir(baseDir, configData) {
	// path.resolve是以运行命令文件夹为base
	return path.resolve(baseDir, configData.rootDirName)
}



// createBookDirs()
// clean()

module.exports = (cmdPath, command, baseDir = cmdPath) => {
	const configData = require('./config').createDirConfig
	const bookRootDir = getRootDir(baseDir, configData)
	if (!bookRootDir) return

	switch(command) {
		case 'create':
			createBookDirs(bookRootDir, configData)
			break
		case 'clean':
			clean(bookRootDir)
			break
		default:
			console.log(`createDir脚本不存在${command}指令，可选择create/clean脚本指令，然后接路径参数`)
	}
}