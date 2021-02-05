// Database
const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class User {
   constructor(username, email) {
      this.username = username;
      this.email = email;
   }

   save() {
      const db = getDB();
      return db.collection('users').insertOne(this);
   }

   static fetchAll() {
      const db = getDB();
      return db.collection('users')
         .find()
         .toArray()
         .then(users => users)
         .catch(err => console.log(err));
   }

   static findByID(userID) {
      const db = getDB();
      return db.collection('users').findOne({ _id: new mongodb.ObjectId(userID) });
   }
}

module.exports = User;