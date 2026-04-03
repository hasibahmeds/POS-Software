const mysql = require('mysql2/promise');

async function manageDemoData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hasib12345',
    database: 'pos_software'
  });

  const action = process.argv[2]; // 'remove', 'view', 'count'

  switch (action) {
    case 'view':
      const [products] = await connection.execute(
        "SELECT * FROM products WHERE name LIKE 'Coffee%' ORDER BY id LIMIT 20"
      );
      console.log('First 20 demo products:');
      products.forEach(p => console.log(`ID: ${p.id}, Name: ${p.name}, ProductId: ${p.productId}, Quantity: ${p.quantity}, Price: ${p.price}`));
      break;

    case 'count':
      const [countResult] = await connection.execute(
        "SELECT COUNT(*) as total FROM products WHERE name LIKE 'Coffee%'"
      );
      console.log(`Total demo products: ${countResult[0].total}`);
      break;

    case 'remove':
      await connection.execute(
        "DELETE FROM products WHERE name LIKE 'Coffee%'"
      );
      console.log('Removed all demo products (Coffee*)');
      break;

    case 'remove-by-count':
      const numToRemove = parseInt(process.argv[3]) || 10;
      await connection.execute(
        `DELETE FROM products WHERE name LIKE 'Coffee%' ORDER BY id LIMIT ${numToRemove}`
      );
      console.log(`Removed ${numToRemove} demo products`);
      break;

    default:
      console.log('Usage: node manage_demo_data.js <action>');
      console.log('Actions:');
      console.log('  view              - View first 20 demo products');
      console.log('  count             - Count total demo products');
      console.log('  remove            - Remove all demo products');
      console.log('  remove-by-count N - Remove N demo products');
  }

  await connection.end();
}

manageDemoData().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
