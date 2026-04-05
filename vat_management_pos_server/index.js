const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require('./config/db');
const { Op } = require('sequelize');
const User = require('./models/User');
const Product = require('./models/Product');
const Booking = require('./models/Booking');
const { Buy, BuyItem } = require('./models/Buy');
const UpdateProduct = require('./models/UpdateProduct');

// Load all model associations
require('./models/associations');

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    // Sync with alter to update existing tables
    await sequelize.sync({ alter: true });
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

    // get user by email
    app.get('/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const user = await User.findOne({ where: { email } });
        if (user) {
          res.send({ ...user.toJSON(), _id: user.id });
        } else {
          res.status(404).send({ error: 'User not found' });
        }
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

    // // get products with optional search and pagination
    app.get('/allProduct', async (req, res) => {
      try {
        const { search, limit, offset } = req.query;
        let where = {};
        
        if (search && search.trim() !== '') {
          const searchTerm = `%${search.trim()}%`;
          where = {
            [Op.or]: [
              { name: { [Op.like]: searchTerm } },
              { productId: { [Op.like]: searchTerm } }
            ]
          };
        }
        
        // Build query options
        const queryOptions = { where };
        
        // Add pagination if limit and offset are provided
        if (limit && parseInt(limit) > 0) {
          queryOptions.limit = parseInt(limit);
          if (offset && parseInt(offset) >= 0) {
            queryOptions.offset = parseInt(offset);
          }
        }
        
        const products = await Product.findAll(queryOptions);
        const modifiedProducts = products.map(p => ({ ...p.toJSON(), _id: p.id }));
        
        // Get total count for pagination
        const totalCount = await Product.count({ where });
        
        res.send({
          products: modifiedProducts,
          total: totalCount,
          hasMore: modifiedProducts.length === parseInt(limit) && (parseInt(offset || 0) + modifiedProducts.length) < totalCount
        });
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
        const { name, img, productId, price } = req.body;
        const result = await Product.update(
          { name, img, productId, price },
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

    // // get product by productId
    app.get('/allProducts/:id', async (req, res) => {
      try {
        const productId = req.params.id;
        const result = await Product.findOne({ where: { productId: productId } });
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
        
        // Handle both old format (singleProduct JSON) and new format (individual columns)
        let updateData;
        if (postResult.singleProduct) {
          // Old format - extract from singleProduct JSON object
          updateData = {
            productId: postResult.singleProduct.productId,
            name: postResult.singleProduct.name,
            img: postResult.singleProduct.img,
            price: postResult.singleProduct.price,
            updateQuantity: postResult.updateQuantity,
            date: postResult.date,
            lastQuantityAdd: postResult.lastQuantityAdd
          };
        } else {
          // New format - use columns directly
          updateData = {
            productId: postResult.productId,
            name: postResult.name,
            img: postResult.img,
            price: postResult.price,
            updateQuantity: postResult.updateQuantity,
            date: postResult.date,
            lastQuantityAdd: postResult.lastQuantityAdd
          };
        }
        
        const result = await UpdateProduct.create(updateData);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    //  get update Product
    app.get('/updateProduct', async (req, res) => {
      try {
        const result = await UpdateProduct.findAll();
        // Convert individual columns to singleProduct format for backward compatibility
        const modifiedResult = result.map(u => ({
          _id: u.id,
          singleProduct: {
            productId: u.productId,
            name: u.name,
            img: u.img,
            price: u.price
          },
          updateQuantity: u.updateQuantity,
          date: u.date,
          lastQuantityAdd: u.lastQuantityAdd
        }));
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

        // Check if the product already exists in the cart (using productId)
        const exists = await Booking.findOne({ where: { productId: product.productId } });

        if (exists) {
          // If it exists, update the quantity (Add new quantity to old quantity)
          const newQuantity = parseInt(exists.bookQuantity) + parseInt(product.bookQuantity);

          await Booking.update(
            { bookQuantity: newQuantity },
            { where: { productId: product.productId } }
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
        
        // Extract bookings array and create Buy record
        const { bookings, ...buyData } = postResult;
        
        // Create the Buy record first
        const buyRecord = await Buy.create(buyData);
        
        // If there are bookings, create BuyItem records for each
        // Handle both array format and legacy single-item objects
        let bookingsArray = [];
        if (bookings && Array.isArray(bookings)) {
          bookingsArray = bookings;
        } else if (bookings && typeof bookings === 'object') {
          // Legacy single-item format or empty object
          bookingsArray = [bookings];
        }
        
        try {
          for (const item of bookingsArray) {
            if (item && item.productId) {
              await BuyItem.create({
                buyId: buyRecord.id,
                productId: item.productId,
                name: item.name,
                price: item.price,
                img: item.img,
                bookQuantity: item.bookQuantity || 1
              });
            }
          }
        } catch (itemError) {
          // If buy_items table doesn't exist, just continue
          console.log('BuyItems table may not exist yet:', itemError.message);
        }
        
        // Fetch the complete record with items
        try {
          const result = await Buy.findByPk(buyRecord.id, {
            include: [{ model: BuyItem, as: 'items' }]
          });
          res.send(result);
        } catch (fetchError) {
          // Return basic record if no items table
          res.send(buyRecord);
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // // get booking products
    app.get('/buys', async (req, res) => {
      try {
        let result;
        try {
          result = await Buy.findAll({
            include: [{ model: BuyItem, as: 'items' }]
          });
          const modifiedResult = result.map(b => {
            const json = b.toJSON();
            // Convert items array to bookings format for backward compatibility
            const items = json.items || [];
            // Map items to the same format as the old bookings JSON
            const bookings = items.map(item => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              img: item.img,
              bookQuantity: item.bookQuantity
            }));
            return { 
              ...json, 
              _id: b.id,
              bookings: bookings
            };
          });
          res.send(modifiedResult);
        } catch (includeError) {
          // If buy_items table doesn't exist yet, return just buys data
          result = await Buy.findAll();
          const modifiedResult = result.map(b => ({
            ...b.toJSON(),
            _id: b.id,
            bookings: []
          }));
          res.send(modifiedResult);
        }
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
  res.send('Running Pos Server');
});

app.listen(port, () => {
  console.log('Pos Server is running ');
});