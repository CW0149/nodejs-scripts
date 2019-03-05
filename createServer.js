module.exports = function() {
	return function(cmdPath, port = 8001, path = cmdPath) {
		const http = require('http')
		const fs = require('fs')

			http.createServer(function(req, res) {
				res.writeHeader(200, {"Content-Type": "text/html"})
				try {
					const html = fs.readFileSync(`${path}/index.html`)
		    	res.write(html)
				} catch(err) {
					res.write('no index.html')
				}
		    res.end()
			}).listen(port, function() {
				console.log(`listening port: ${port}\nopen url http://127.0.0.1:${port}`)
			})
	}
}