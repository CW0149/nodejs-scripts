const createDirConfig = {
	path: '/Users/username/Desktop/', // 默认在执行文件根路径, optional 可以是绝对路径或相对路径
	rootDirName: 'book',
	commonFiles: ['README.md', 'a.md'], // 其下子目录都拥有，不含本身
	routes:  [
		{
			name: '入门与进阶',
			commonFiles: ['haha.md'],
			files: ['前言.md'], // 目录下文件
			sub: [{
				name: '子目录'
			}]
		},
		{
			name: '作用域与闭包'
		},
		{
			name: 'this与对象原型'
		},
		{
			name: '类型与文法'
		},
		{
			name: '异步与性能'
		},
		{
			name: 'ES6与未来'
		}
	]
}

module.exports = { createDirConfig }