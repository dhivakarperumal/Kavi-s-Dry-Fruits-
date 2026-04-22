const tables = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL UNIQUE,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      password_hash VARCHAR(255) NOT NULL,
      password VARCHAR(255),
      role VARCHAR(50) DEFAULT 'User',
      provider VARCHAR(50) DEFAULT 'local',
      google_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  categories: `
    CREATE TABLE IF NOT EXISTS categories (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      catId VARCHAR(50) NOT NULL UNIQUE,
      cname VARCHAR(255) NOT NULL,
      cdescription TEXT,
      cimgs LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  products: `
    CREATE TABLE IF NOT EXISTS products (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      healthBenefits TEXT,
      category VARCHAR(255),
      rating DECIMAL(3,2) DEFAULT 0,
      barcode LONGTEXT,
      barcodeValue VARCHAR(100),
      images LONGTEXT,
      variants LONGTEXT,
      totalStock INT DEFAULT 0,
      lastInvoice VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  combos: `
    CREATE TABLE IF NOT EXISTS combos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      healthBenefits TEXT,
      category VARCHAR(255) DEFAULT 'Combo Packs',
      rating DECIMAL(3,2) DEFAULT 0,
      barcode LONGTEXT,
      barcodeValue VARCHAR(100),
      images LONGTEXT,
      comboItems LONGTEXT,
      comboDetails LONGTEXT,
      totalStock INT DEFAULT 0,
      lastInvoice VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  cart: `
    CREATE TABLE IF NOT EXISTS cart (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      productId VARCHAR(50) NOT NULL,
      name VARCHAR(255),
      image LONGTEXT,
      price DECIMAL(10,2),
      quantity INT,
      weight VARCHAR(50),
      category VARCHAR(100),
      type VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  favorites: `
    CREATE TABLE IF NOT EXISTS favorites (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      productId VARCHAR(50) NOT NULL,
      name VARCHAR(255),
      image LONGTEXT,
      price DECIMAL(10,2),
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  coupons: `
    CREATE TABLE IF NOT EXISTS coupons (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      discount DECIMAL(10,2),
      expiryDate DATE,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      orderId VARCHAR(100) NOT NULL UNIQUE,
      userId VARCHAR(100),
      clientName VARCHAR(255),
      clientPhone VARCHAR(50),
      clientGST VARCHAR(100),
      email VARCHAR(255),
      shippingAddress TEXT,
      customerType VARCHAR(50),
      paymentMode VARCHAR(50),
      paymentStatus VARCHAR(50),
      paymentId VARCHAR(255),
      orderStatus VARCHAR(50),
      shippingCharge DECIMAL(10,2),
      gstAmount DECIMAL(10,2),
      totalAmount DECIMAL(10,2),
      items JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  dealers: `
    CREATE TABLE IF NOT EXISTS dealers (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      dealerId VARCHAR(50) NOT NULL UNIQUE,
      dealerName VARCHAR(255) NOT NULL,
      dealerGSTNumber VARCHAR(100),
      dealerPhoneNumber VARCHAR(20) NOT NULL,
      dealerMail VARCHAR(255),
      dealerAddress TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  invoices: `
    CREATE TABLE IF NOT EXISTS invoices (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      invoiceNo VARCHAR(100) NOT NULL UNIQUE,
      dealerId VARCHAR(50),
      invoiceDate DATE,
      totalAmount DECIMAL(15,2),
      gstAmount DECIMAL(15,2),
      items JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  stock_history: `
    CREATE TABLE IF NOT EXISTS stock_history (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50),
      productName VARCHAR(255),
      type VARCHAR(50),
      changeAmount INT,
      finalStock INT,
      invoiceNumber VARCHAR(100),
      action VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  seo_settings: `
    CREATE TABLE IF NOT EXISTS seo_settings (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      page_name VARCHAR(100) UNIQUE,
      title VARCHAR(255),
      description TEXT,
      keywords TEXT,
      og_image VARCHAR(255),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  app_settings: `
    CREATE TABLE IF NOT EXISTS app_settings (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE,
      setting_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `
};

module.exports = tables;
