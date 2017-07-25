const pg = require('pg')

const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client(connectionString)

client.connect()

// Query helper function
const query = function(sql, variables, callback) {
  console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)

  client.query(sql, variables, function(error, result) {
    if (error) {
      console.log('QUERY <- !!ERROR!!')
      console.error(error)
      callback(error)
    } else {
      console.log('QUERY <-', JSON.stringify(result.rows))
      callback(error, result.rows)
    }
  })
}

const getAlbums = function(callback) {
  query("SELECT * FROM albums", [], callback)
}

const getAlbumsByID = function(albumID, callback) {
  query("SELECT * FROM albums WHERE id = $1", [albumID], callback)
}

const createUser = function(certificate, callback) {
  query(`INSERT INTO users (name, email, password, date_joined) 
         VALUES ($1, $2, $3, $4) RETURNING *`, certificate, callback)
}

const getUserByID = function(id, callback) {
  query("SELECT * FROM users WHERE id = $1", [id], callback)
}

const getUserByEmail = function(email, callback) {
  query("SELECT * FROM users WHERE email = $1", [email], callback)
}

const getUserReviews = function(albumID, callback) {
  query(`SELECT reviews.*, albums.title AS album_title, users.name AS author FROM reviews 
         JOIN albums ON reviews_album_id = albums.id
         JOIN users ON reviews.author_id = users.id
         WHERE albums.id = $1`, [albumID], callback)
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  createUser,
  getUserByID,
  getUserByEmail,
  getUserReviews
}
