require('dotenv').config()
const express = require('express')
const session = require('express-session')
const user_routes = require('./routes/authenticationRoutes')
const product_routes = require('./routes/productRoutes')
const mysql = require('mysql')

let mysql_connection = mysql.createConnection({
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE_NAME,
	host: process.env.HOST
})

mysql_connection.connect(function (error){
	if (error){
		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
		console.log(error)
		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
	}
})

const connection_config = {
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE_NAME,
	host: process.env.HOST
}

function handle_db_disconnect(){
	mysql_connection = mysql.createConnection(connection_config)
	mysql_connection.connect(function (error){
		if (error){
			console.log('database connection error')
			setTimeout(handle_db_disconnect, 3000)
		}	else {
			console.log('database connected')
		}
	})
	mysql_connection.on('error', function(error){
		if (error.code == 'PROTOCOL_CONNECTION_LOST'){
			handle_db_disconnect()
		}	else {
			console.log('failed to reconnect')
		}
	})
}

handle_db_disconnect()

const app = express()

app.set('view engine', 'ejs')

let PORT = process.env.PORT || 5000

app.use(session({
	secret: "ecommerce",
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false, httpOnly: true },
}))

// set cookie: { secure: true } when https is used

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))


app.get('/', function(request, response){
	if (request.sessionID){
		let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
		mysql_connection.query(find_session_query, [request.sessionID], function(error, result){
			if (error) console.log(error)
			if (result.length == 0){
				return response.render('index', { title: "Home", user: null }) 
			}	else {
				let found_session = result[0]
				if (found_session.user_id == -1){
					return response.render('index', { title: "Home", user: null })
				}	else {
					let find_user_query = "SELECT * FROM users WHERE id = ?"
					mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
						if (error) console.log(error)
						return response.render('index', { title: "Home", user: result[0] })
					})
				}
			}
		})
	}	else {
		return response.render('index', { title: "Home", user: null })
	}
})

app.use(user_routes.router)
app.use(product_routes.router)

app.get('*', function(request, response){
		let user = null 
	if (request.sessionID){
		let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
		mysql_connection.query(find_session_query, [request.sessionID], function(error, result){
			if (error) console.log(error)
			if (result.length == 0){
				return response.render('404error', { title: "Page not found", user: null })
			}	else {
				let found_session = result[0]
				if (found_session.user_id == -1){
					return response.render('404error', { title: "Page not found", user: null })
				}	else {
					let find_user_query = "SELECT * FROM users WHERE id = ?"
					mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
						if (error) console.log(error)
						return response.render('404error', { title: "Page not found", user: result[0] })
					})
				}
			}
		})
	}	else {
		return response.render('404error', { title: "Page not found", user: null })
	}
})

app.listen(PORT, function(){
	console.log('server running')
})