const mysql = require('mysql')

const mysql_connection = mysql.createConnection({
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE_NAME,
	host: process.env.HOST,
})

mysql_connection.connect(function (error){
	if (error){
		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
		console.log(error)
		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
	}	else {
		console.log('database connected')
	}
})

function register_post(request, response){
	let typed_input = request.body
	let check_existing_email_query = "SELECT * FROM users WHERE email = ?"
	mysql_connection.query(check_existing_email_query, [typed_input.email], function(error, result){
		if (error) console.log(error)
		if (result.length > 0){
			return response.status(201).json({ "error": "This email is already taken!" })
		}	else {
			let create_new_user_query = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)"
			mysql_connection.query(create_new_user_query, [typed_input.first_name, typed_input.last_name, typed_input.email, typed_input.password], function(error, result){
				if (error) console.log(error)
				let new_user = result 
				let create_session_query = 'INSERT INTO userSessions (session_id, user_id, expiration_date) VALUES (?, ?, now() + interval 1 day)'
				mysql_connection.query(create_session_query, [request.sessionID, new_user.insertId], function(error, result){
					if (error) console.log(error)
					let session = result
					let create_cart_query = 'INSERT INTO cart (user_id, session_id, subtotal, tax, shipping, total, expiration) VALUES (?, ?, ?, ?, ?, ?, now() + interval 1 day)'
					mysql_connection.query(create_cart_query, [new_user.insertId, request.sessionID, 0, 0, 0, 0], function(error, result){
						if (error) console.log(error)
						return response.status(201).json({ "success": "New user registered" })
					})
				})
			})
		}
	})
}

function login_post(request, response){
	let typed_input = request.body
	let check_existing_user_query = "SELECT * FROM users WHERE email = ?"
	mysql_connection.query(check_existing_user_query, [typed_input.email], function(error, result){
		if (error) console.log(error)
		if (result.length == 0){
			return response.status(201).json({ "error": "Invalid email and/or password" })
		}	else {
			let user = result[0]
			if (user.password != typed_input.password){
				return response.status(201).json({ "error": "Invalid email and/or password" })
			}	else {
				let create_session_query = 'INSERT INTO userSessions (session_id, user_id, expiration_date) VALUES (?, ?, now() + interval 1 day)'
				mysql_connection.query(create_session_query, [request.sessionID, user.id], function(error, result){
					if (error) console.log(error)
					let session = result
					let create_cart_query = 'INSERT INTO cart (user_id, session_id, subtotal, tax, shipping, total, expiration) VALUES (?, ?, ?, ?, ?, ?, now() + interval 1 day)'
					mysql_connection.query(create_cart_query, [user.id, request.sessionID, 0, 0, 0, 0], function(error, result){
						if (error) console.log(error)
						return response.status(201).json({ "success": "User logged in" })
					})
				})
			}
		}
	})
}

function cart(request, response){
	let session = request.sessionID
	if (!session) return response.render("user/cart", { title: 'Cart', items: [], user: null})
	let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
	mysql_connection.query(find_session_query, [session], function(error, result){
		if (error) console.log(error)
		if (result.length > 0){
			let found_session = result[0]
			let find_user_query = "SELECT * FROM users WHERE id = ?"
			mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
				if (error) console.log(error)
				let user = result[0]
				console.log('user')
				console.log(user)
				let find_cart_query = "SELECT * FROM cart WHERE cart.session_id = ?"
				mysql_connection.query(find_cart_query, [request.sessionID], function(error, result){
					if (error) console.log(error)
					if (result.length == 0){
						return response.render("user/cart", { title: 'Cart', items: [], user: user })
					}	else {
						let cart = result[0]
						let product_id_in_cart_query = "SELECT * FROM cartItem WHERE cartItem.cart_id = ?"
						mysql_connection.query(product_id_in_cart_query, [cart.id], function(error, results){
							if (error) console.log(error)
							return response.render('user/cart', { title: 'Cart', items: results, user: user })
						})
					}
				})	
			})
		}	else {
			return response.render("user/cart", { title: 'Cart', items: [], user: null})
		}
	})
}

function sign_in(request, response){
	let session = request.sessionID
	if (!session) return response.render('user/signIn', { title: 'Sign Up', user: null })
	let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
	mysql_connection.query(find_session_query, [session], function(error, result){
		if (error) console.log(error)
		if (result.length == 0){
			return response.render('user/signIn', { title: 'Sign Up', user: null })
		}	else {
			let found_session = result[0]
			if (found_session.user_id == -1){
				return response.render('user/signIn', { title: 'Sign Up', user: null })
			} else {
				let find_user_query = "SELECT * FROM users WHERE id = ?"
				mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
					if (error) console.log(error)
					return response.render('404error', { title: 'Page not found', user: result[0] })
				})
			}
		}
	})
}

function register(request, response){
	let session = request.sessionID
	if (!session) return response.render('user/register', { title: 'Sign Up', user: null })
	let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
	mysql_connection.query(find_session_query, [session], function(error, result){
		if (error) console.log(error)
		if (result.length == 0){
			return response.render('user/register', { title: 'Sign Up', user: null })
		}	else {
			let found_session = result[0]
			if (found_session.user_id == -1){
				return response.render('user/register', { title: 'Sign Up', user: null })
			} else {
				let find_user_query = "SELECT * FROM users WHERE id = ?"
				mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
					if (error) console.log(error)
					return response.render('404error', { title: 'Page not found', user: result[0] })
				})
			}
		}
	})
}

function add_to_cart(request, response){
	let product_query = 'SELECT * FROM products WHERE id = ?'
	mysql_connection.query(product_query, [request.body.id], function(error, result){
		if (error) console.log(error)
		// let product = result[0]
		let product = request.body
		let product_price = product.price
		let find_session_query = 'SELECT * FROM userSessions WHERE session_id = ?'
		mysql_connection.query(find_session_query, [request.sessionID], function(error, result){
			if (error) console.log(error)
			let user = result
			console.log('user')
			console.log(user)
			if (user.length == 0){
				let create_session_query = 'INSERT INTO userSessions (session_id, user_id, expiration_date) VALUES (?, -1, now() + interval 1 day)'
				mysql_connection.query(create_session_query, [request.sessionID], function(error, result){
					if (error) console.log(error)
					let session = result
					let create_cart_query = 'INSERT INTO cart (user_id, session_id, subtotal, tax, shipping, total, expiration) VALUES (-1, ?, ?, ?, ?, ?, now() + interval 1 day)'
					let total = product_price + product_price * .1
					mysql_connection.query(create_cart_query, [request.sessionID, product_price, product_price * .1, 0, total], function(error, result){
						if (error) console.log(error)
						let cart = result
						let add_product_to_cart_query = "INSERT INTO cartItem (cart_id, product_id, product_title, product_price, expiration, coupon, quantity) VALUES (?, ?, ?, ?, now() + interval 1 day, 'null', 1)"
						mysql_connection.query(add_product_to_cart_query, [cart.insertId, product.id, product.title, product.price], function(error, result){
							if  (error) console.log(error)
							return response.status(201).send({ "status": "success"})
						})
					})	
				})
			}	else {
				console.log('user already exists')
				let existing_user_session_id = user[0].session_id
				console.log(existing_user_session_id)
				let update_cart_query = "UPDATE cart SET subtotal = subtotal + ?, tax = tax + ?, shipping = shipping + ?, total = total + ? WHERE cart.session_id = ?"
				let total = product_price + product_price * .1
				mysql_connection.query(update_cart_query, [product_price, product_price * .1, 0, total, existing_user_session_id], function(error, result){
					if (error) {
						console.log(error)
					}
					let find_cart_query = "SELECT * FROM cart WHERE cart.session_id = ?"
					mysql_connection.query(find_cart_query, [existing_user_session_id], function(error, result){
						if (error) console.log(error)
						let cart = result
						let add_product_to_cart_query = "INSERT INTO cartItem (cart_id, product_id, product_title, product_price, expiration, coupon, quantity) VALUES (?, ?, ?, ?, now() + interval 1 day, 'null', 1)"
						mysql_connection.query(add_product_to_cart_query, [cart[0].id, product.id, product.title, product.price], function(error, result){
							if  (error) console.log(error)
							return response.status(201).send({ "status": "success"})
						})
					})
						
					
				})
			}
		})
	})

}

function add_more_to_cart(request, response){
	console.log('inside add_more_to_cart')
	let session_id = request.sessionID
	let product = request.body
	let find_cart_query = "SELECT * FROM cart WHERE cart.session_id = ?"
	mysql_connection.query(find_cart_query, [session_id], function(error, result){
		if (error) console.log(error)
		let cart = result[0]
		console.log(cart)
		let add_product_to_cart_query = "INSERT INTO cartItem (cart_id, product_id, product_title, product_price, expiration, coupon, quantity) VALUES (?, ?, ?, ?, now() + interval 1 day, 'null', 1)"
		mysql_connection.query(add_product_to_cart_query, [cart.id, product.id, product.title, product.price], function(error, result){
			if  (error) console.log(error)
			console.log(result)
			return response.status(201).json({ "cart_item_id": result.insertId })
		})
	})		
}

function remove_from_cart(request, response){
	let remove_cart_item_query = 'DELETE FROM cartItem WHERE id = ?'
	mysql_connection.query(remove_cart_item_query, [request.body.id], function(error, result){
		console.log(error)
		return response.status(201).send()
	}) 
}

function profile(request, response){
	let session = request.sessionID
	if (!session) return response.render('404error', { title: 'Page not found', user: null }) 
	let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
	mysql_connection.query(find_session_query, [session], function(error, result){
		if (error) console.log(error)
		if (result.length == 0){
			return response.render('404error', { title: 'Page not found', user: null })
		}	else {
			let found_session = result[0]
			if (found_session.user_id == -1){
				return response.render('404error', { title: 'Page not found', user: null })
			}	else {
				let find_user_query = "SELECT * FROM users WHERE id = ?"
				mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
					if (error) console.log(error)
					return response.render('user/profile', { title: 'Profile', user: result[0] })
				})
			}
		}
	})
}

function logout(request, response){
	let session = request.sessionID
	if (!session) return response.render('404error', { title: 'Page not found', user: null }) 
	let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
	mysql_connection.query(find_session_query, [session], function(error, result){
		if (error) console.log(error)
		if (result.length == 0){
			return response.render('404error', { title: 'Page not found', user: null })
		}	else {
			let found_session = result[0]
			if (found_session.user_id == -1){
				return response.render('404error', { title: 'Page not found', user: null })
			}	else {
				let find_cart_query = "SELECT * FROM cart WHERE session_id = ?"
				mysql_connection.query(find_cart_query, [found_session.session_id], function(error, result){
					if (error) console.log(error)
					let cart = result[0]
					let delete_all_cart_items_query = "DELETE FROM cartItem WHERE cart_id = ?"
					mysql_connection.query(delete_all_cart_items_query, [cart.id], function(error, result){
						if (error) console.log(error)
						let delete_cart_query = "DELETE FROM cart WHERE id = ?"
						mysql_connection.query(delete_cart_query, [cart.id], function(error, result){
							if (error) console.log(error)
							let delete_session_query = "DELETE FROM userSessions WHERE session_id = ?"
							mysql_connection.query(delete_session_query, [found_session.session_id], function(error, result){
								if (error) console.log(error)
								return response.render('index', { title: 'Home', user: null })
							})
						})
					})
				})
			}
		}
	})
}

function checkout(request, response){
let session = request.sessionID
	if (!session) return response.render('404error', { title: 'Page not found', user: null }) 
	let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
	mysql_connection.query(find_session_query, [session], function(error, result){
		if (error) console.log(error)
		if (result.length == 0){
			return response.render('404error', { title: 'Page not found', user: null })
		}	else {
			let found_session = result[0]
			if (found_session.user_id == -1){
				return response.render('user/signIn', { title: 'Log In', user: null })
			}	else {
				let find_user_query = "SELECT * FROM users WHERE id = ?"
				mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
					if (error) console.log(error)
					return response.render('user/checkout', { title: 'Checkout', user: result[0] })
				})
			}
		}
	})
}

module.exports = { register_post, login_post, cart, sign_in, register, add_to_cart, remove_from_cart, add_more_to_cart, profile, logout, checkout }