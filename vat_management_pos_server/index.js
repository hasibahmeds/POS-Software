const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Booking = require('./models/Booking');
const Buy = require('./models/Buy');
const UpdateProduct = require('./models/UpdateProduct');

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await sequelize.sync();
    // console.log("Database connected and synced");

    // // // // // // // // // // // // //
    // // post User
    //create and update a user
    app.put('/create-user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const user = req.body;
        
        await User.upsert({ ...user, email });
        res.send({ acknowledged: true });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get all user
    app.get('/user', async (req, res) => {
      try {
        const users = await User.findAll();
        // Frontend uses _id occasionally, so injecting it for compatibility
        const modifiedUsers = users.map(u => ({ ...u.toJSON(), _id: u.id }));
        res.send(modifiedUsers);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // //                  product   //
    // // post product
    app.post('/allProduct', async (req, res) => {
      try {
        const productData = req.body;
        const result = await Product.create(productData);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // get products
    app.get('/allProduct', async (req, res) => {
      try {
        const products = await Product.findAll();
        const modifiedProducts = products.map(p => ({ ...p.toJSON(), _id: p.id }));
        res.send(modifiedProducts);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // get product by id
    app.get('/product/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await Product.findByPk(id);
        if (result) {
            res.send({ ...result.toJSON(), _id: result.id });
        } else {
            res.send(null);
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // restock product item and update
    app.put('/productId/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updateQuantity = req.body.quantity;
        const result = await Product.update(
          { quantity: updateQuantity },
          { where: { id: id } }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // update product details (Name, Image, Product ID, Price)
    app.put('/product-update/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { name, img, pId, price } = req.body;
        const result = await Product.update(
          { name, img, pId, price },
          { where: { id: id } }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


    // // Delete one product
    app.delete('/product/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await Product.destroy({ where: { id: id } });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // get product by pId
    app.get('/allProducts/:id', async (req, res) => {
      try {
        const pId = req.params.id;
        const result = await Product.findOne({ where: { pId: pId } });
        if (result) {
            res.send({ ...result.toJSON(), _id: result.id });
        } else {
            res.send(null);
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // Delete all product
    app.delete('/productDelete', async (req, res) => {
      try {
        const result = await Product.destroy({ where: {} });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // update Product (Restock History)
    app.post('/updateProduct', async (req, res) => {
      try {
        const postResult = req.body;
        const result = await UpdateProduct.create(postResult);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    //  get update Product
    app.get('/updateProduct', async (req, res) => {
      try {
        const result = await UpdateProduct.findAll();
        const modifiedResult = result.map(u => ({ ...u.toJSON(), _id: u.id }));
        res.send(modifiedResult);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // DELETE individual update product history record
    app.delete('/updateProduct/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await UpdateProduct.destroy({ where: { id: id } });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // DELETE ALL update product history records together
    app.delete('/updateProductDelete', async (req, res) => {
      try {
        const result = await UpdateProduct.destroy({ where: {} });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // // booking Product (UPDATED LOGIC)
    app.post('/bookings', async (req, res) => {
      try {
        const product = req.body;

        // Check if the product already exists in the cart (using pId)
        const exists = await Booking.findOne({ where: { pId: product.pId } });

        if (exists) {
          // If it exists, update the quantity (Add new quantity to old quantity)
          const newQuantity = parseInt(exists.bookQuantity) + parseInt(product.bookQuantity);

          await Booking.update(
            { bookQuantity: newQuantity },
            { where: { pId: product.pId } }
          );
          res.send({ acknowledged: true });
        } else {
          // If it doesn't exist, insert it as a new row
          const result = await Booking.create(product);
          res.send(result);
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // get booking products
    app.get('/booking', async (req, res) => {
      try {
        const result = await Booking.findAll();
        const modifiedResult = result.map(b => ({ ...b.toJSON(), _id: b.id }));
        res.send(modifiedResult);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Delete all book
    app.delete('/bookings', async (req, res) => {
      try {
        const result = await Booking.destroy({ where: {} });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Delete one book  Product
    app.delete('/booking/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await Booking.destroy({ where: { id: id } });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


    // buy information
    app.post('/buys', async (req, res) => {
      try {
        const postResult = req.body;
        postResult.customerName = postResult.name;
        
        const result = await Buy.create(postResult);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // get booking products
    app.get('/buys', async (req, res) => {
      try {
        const result = await Buy.findAll();
        const modifiedResult = result.map(b => ({ ...b.toJSON(), _id: b.id }));
        res.send(modifiedResult);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Delete ALL sales (buys) history records together
    app.delete('/buyDeleteAll', async (req, res) => {
      try {
        const result = await Buy.destroy({ where: {} });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Delete individual sale (buy) record
    app.delete('/buy/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await Buy.destroy({ where: { id: id } });
        res.send({ deletedCount: result });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

  } catch (error) {
    console.dir(error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Vat Management Pos Server');
});

app.listen(port, () => {
  console.log('Vat Management Pos Server is running ');
});