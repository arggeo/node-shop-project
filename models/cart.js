const fs = require('fs');
const path = require('path');

// Util
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
   static addProduct(id, productPrice) {
      // Fetch the previous cart
      fs.readFile(p, (err, fileContent) => {
         let cart = {products: [], totalPrice: 0};
         if (!err) {
            cart = JSON.parse(fileContent);
         }

         // Analyze the cart => Find existing products
         const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
         const existingProduct = cart.products[existingProductIndex];
         let updatedProduct;

         // Add new products / increase quantities
         if (existingProduct) {
            updatedProduct = { ...existingProduct };
            updatedProduct.qty++;
            cart.products[existingProductIndex] = updatedProduct;
         } else {
            updatedProduct = { id: id, qty: 1 };
            cart.products = [ ...cart.products, updatedProduct ];
         }
         cart.totalPrice += +productPrice;
         fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
         });
      });
   }

   static deleteProduct(id, productPrice) {
      fs.readFile(p, (err, fileContent) => {
         if (err) {
            return;
         }
         const updatedCart = { ...JSON.parse(fileContent) };
         const product = updatedCart.products.find(prod => prod.id === id);
         updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
         updatedCart.totalPrice -= productPrice * product.qty;
         fs.writeFile(p, JSON.stringify(updatedCart), err => {
            console.log(err);
         });
      });
   }
}