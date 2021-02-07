// Database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   imageUrl: {
      type: String,
      required: true
   },
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
});

module.exports = mongoose.model('Product', productSchema);

// // Database
// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;
//
// class Product {
//    constructor(title, price, description, imageUrl, id, userId) {
//       this.title = title;
//       this.price = price;
//       this.description = description;
//       this.imageUrl = imageUrl;
//       this._id = id ? new mongodb.ObjectId(id) : null;
//       this.userId = userId;
//    }
//
//    save() {
//       const db = getDB();
//       let dbOp;
//       if (this._id) {
//          dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//       } else {
//          dbOp = db.collection('products').insertOne(this);
//       }
//       return dbOp.then(result => console.log(result))
//          .catch(err => console.log(err));
//    }
//
//    static fetchAll() {
//       const db = getDB();
//       return db.collection('products')
//          .find()
//          .toArray()
//          .then(products => products)
//          .catch(err => console.log(err));
//    }
//
//    static findByID(prodID) {
//       const db = getDB();
//       return db.collection('products')
//          .find({ _id: new mongodb.ObjectId(prodID) })
//          .next()
//          .then(product => product)
//          .catch(err => console.log(err));
//    }
//
//    static deleteByID(prodID) {
//       const db = getDB();
//       return db.collection('products')
//          .deleteOne({ _id: new mongodb.ObjectId(prodID) })
//          .then(result => console.log('Deleted'))
//          .catch(err => console.log(err));
//    }
// }
//
// module.exports = Product;