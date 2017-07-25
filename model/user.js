const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const database = require('../database');

class User {

  createUser(email, password, name) {
    var hash = bcrypt.hashSync(password);
    return database.createUser({
      text: 'INSERT INTO users (name, email, password, date_joined) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [email, hash, name, moment().format('MM-DD-YYYY'), 1]
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
