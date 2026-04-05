const mysql = require('mysql2/promise');

async function insertDemoData() {
  // Create connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hasib12345',
    database: 'pos_software'
  });

  console.log('Connected to MySQL database');

  // Demo data template
  const baseData = {
    name: "Coffee",
    productId: "4",
    quantity: 70,
    price: "50.00",
    img: "https://cdn.othoba.com/images/thumbs/0126956_kofi-house-1-kg-3-in-1-coffee.jpeg"
  };

  // Insert 600 demo products (starting from id=21, incrementing by 1)
  for (let i = 0; i < 50000; i++) {
    const newId = 21 + i;
    const newName = `Coffee${i}`;
    const newProductId = String(5 + i);
    const newQuantity = 71 + i;
    const newPrice = (51 + i).toFixed(2);

    await connection.execute(
      `INSERT INTO products (name, productId, quantity, price, img, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [newName, newProductId, newQuantity, newPrice, baseData.img]
    );

    console.log(`Inserted product ${newId}: ${newName}, ProductId: ${newProductId}, Quantity: ${newQuantity}, Price: ${newPrice}`);
  }

  console.log('Successfully inserted 50000 demo products!');

  // Close connection
  await connection.end();
}

insertDemoData().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
