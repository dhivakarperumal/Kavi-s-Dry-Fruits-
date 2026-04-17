const db = require('./src/config/db');

db.query('SHOW TABLES')
  .then(([tables]) => {
    console.log(JSON.stringify(tables));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
