'use strict'

const express = require('express');
const app = express();
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

app.engine('html', es6Renderer)
app.set('views', 'html')
app.set('view engine', 'html')

const parser = bodyParser.urlencoded({ extended: true })
app.use(parser)

const sqlite3 = require('sqlite3').verbose()

const DBName = 'Feedback'

const db = new sqlite3.Database(`./${DBName}.db`, (err) => {
	if (err) return console.error(err.message)
	console.log(`Connected to the "${DBName}" SQlite database.`)
	const sql = 'CREATE TABLE IF NOT EXISTS FeedbackTable(comment text)'
	db.run(sql)
})

app.get('/', (req, res) => {
	
	if (req.query.comment) {
		const comment = req.query.comment
		console.log(`adding comment`)
		const sql = `INSERT INTO FeedbackTable VALUES("${comment}")`
		console.log(sql)
		db.run(sql, err => {
			console.log(`inserting comment into database`)
			if(err) console.error(`error: ${err.message}`)
			if(!err) console.log(`added comment`)
		})
		console.log(`adding comment to the list`)
	}
	
	const sqlSelect = `SELECT comment FROM FeedbackTable`
	console.log(sqlSelect)
	const data = {}
	db.all(sqlSelect, (err, rows) => {
		if(err) console.error(err.message)
		data.comments = rows.map( row => `${row.comment}<hr>`).join('')
		res.render('index', {locals: data})
	})
})

io.sockets.on("connection", function(socket) {
    socket.on("chat-message", function(message) {
        io.sockets.emit("chat-message", message);
    })
})

server.listen(process.env.PORT || 8080, function() {
  console.log('app listening')
})