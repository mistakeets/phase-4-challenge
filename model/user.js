const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const db = require('../database');

class User {

  createUser(email, password, name) {
    var hash = bcrypt.hashSync(password);
    return db.one({
      text: 'INSERT INTO users (email, password, name, date_joined, current_city) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [email, hash, name, moment().format('M-D-YYYY'), 1]
    })
  }

  findByEmail(email) {
    return db.one({
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email]
    })
  }

  isValidUser(email, password) {
    return db.any({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email]
      })
      .then((result) => {
        var hash = bcrypt.compareSync(password, result[0].password)
        if (hash) {
          return result[0]
        }
      })
  }
}

module.exports = new User(db);
