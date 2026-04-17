const db = require('./src/config/db');

db.query('SHOW COLUMNS FROM users')
  .then(([cols]) => {
    console.log(JSON.stringify(cols.map(c => c.Field)));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
