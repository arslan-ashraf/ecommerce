const mysql = require('mysql')

let mysql_connection = mysql.createPool({
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE_NAME,
	host: process.env.HOST,
})

function all_products_in_category(request, response){
	let session = request.sessionID
	if (session){
		let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
		mysql_connection.query(find_session_query, [session], function(error, result){
			if (error) console.log(error)
			if (result.length > 0){
				let found_session = result[0]
				let find_user_query = "SELECT * FROM users WHERE id = ?"
				mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
					if (error) console.log(error)
					let user = result[0]
					let category = request.params.category
					let category_query = 'SELECT * FROM productCategory WHERE name = ?'
					mysql_connection.query(category_query, [category], function (error, results){
						if (error) console.log("sql category_query error")
						let category_id = results[0].id
						let product_query = 'SELECT * FROM products WHERE category_id = ?'
						mysql_connection.query(product_query, [category_id], function(error, results){
							if (error) console.log("sql product_query using category_id error")
							return response.render('products/productslist', { title: 'Products', results: results, category: category, user: user })
						})
					})
				})
			} else {
				let category = request.params.category
				let category_query = 'SELECT * FROM productCategory WHERE name = ?'
				mysql_connection.query(category_query, [category], function (error, results){
					if (error) console.log("sql category_query error")
					let category_id = results[0].id
					let product_query = 'SELECT * FROM products WHERE category_id = ?'
					mysql_connection.query(product_query, [category_id], function(error, results){
						if (error) console.log("sql product_query using category_id error")
						return response.render('products/productslist', { title: 'Products', results: results, category: category, user: null })
					})
				})
			}
		})
	} else {
		let category = request.params.category
		let category_query = 'SELECT * FROM productCategory WHERE name = ?'
		mysql_connection.query(category_query, [category], function (error, results){
			if (error) console.log("sql category_query error")
			let category_id = results[0].id
			let product_query = 'SELECT * FROM products WHERE category_id = ?'
			mysql_connection.query(product_query, [category_id], function(error, results){
				if (error) console.log("sql product_query using category_id error")
				return response.render('products/productslist', { title: 'Products', results: results, category: category, user: null })
			})
		})
	}
}

function get_a_product(request, response){
	let session = request.sessionID
	if (session){
		let find_session_query = "SELECT * FROM userSessions WHERE session_id = ?"
		mysql_connection.query(find_session_query, [session], function(error, result){
			if (error) console.log(error)
			if (result.length > 0){
				let found_session = result[0]
				let find_user_query = "SELECT * FROM users WHERE id = ?"
				mysql_connection.query(find_user_query, [found_session.user_id], function(error, result){
					if (error) console.log(error)
					let user = result[0]
					let product_id = request.params.id
					let product_query = 'SELECT * FROM products WHERE id = ?'
					mysql_connection.query(product_query, [product_id], function(error, result){
						if (error) console.log("sql product_query using product_id error")
						return response.render('products/productDescription', { title: result[0].title, product: result, user: user })
					})
				})
			} else {
				let product_id = request.params.id
				let product_query = 'SELECT * FROM products WHERE id = ?'
				mysql_connection.query(product_query, [product_id], function(error, result){
					if (error) console.log("sql product_query using product_id error")
					return response.render('products/productDescription', { title: result[0].title, product: result, user: null })
				})
			}
		})
	} else {
		let product_id = request.params.id
		let product_query = 'SELECT * FROM products WHERE id = ?'
		mysql_connection.query(product_query, [product_id], function(error, result){
			if (error) console.log("sql product_query using product_id error")
			return response.render('products/productDescription', { title: result[0].title, product: result, user: null })
		})
	}
}

function search(request, response){
	let text = '%' + request.body.text + '%'
	let search_product_query = "SELECT * FROM products WHERE title LIKE ?"
	mysql_connection.query(search_product_query, [text], function(error, results){
		if (error) console.log(error)
		return response.status(201).json({ products: results })
	})
}

module.exports = { all_products_in_category, get_a_product, search }