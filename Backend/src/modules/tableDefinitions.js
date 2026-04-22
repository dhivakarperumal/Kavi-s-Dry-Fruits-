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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  reviews: `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      reviewId VARCHAR(50) NOT NULL UNIQUE,
      userName VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      image LONGTEXT,
      selected BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      orderId VARCHAR(50) NOT NULL UNIQUE,
      userId VARCHAR(50),
      clientName VARCHAR(255),
      clientPhone VARCHAR(50),
      clientGST VARCHAR(100),
      email VARCHAR(255),
      shippingAddress TEXT,
      customerType VARCHAR(100),
      paymentMode VARCHAR(100),
      paymentStatus VARCHAR(100),
      paymentId VARCHAR(255),
      orderStatus VARCHAR(100) DEFAULT 'Pending',
      shippingCharge DECIMAL(15,2),
      items LONGTEXT,
      gstAmount DECIMAL(15,2),
      totalAmount DECIMAL(15,2),
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
      invoiceDate DATE,
      invoiceValue DECIMAL(15,2),
      invoiceGSTValue DECIMAL(15,2),
      invoiceTotalValue DECIMAL(15,2),
      transportAmount DECIMAL(15,2),
      billPdfBase64 LONGTEXT,
      billPdfName VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  stock_history: `
    CREATE TABLE IF NOT EXISTS stock_history (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50) NOT NULL,
      productName VARCHAR(255),
      productCategory VARCHAR(255),
      addedQuantity INT,
      finalStock INT,
      invoiceNumber VARCHAR(100),
      type VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  health_benefits: `
    CREATE TABLE IF NOT EXISTS health_benefits (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50),
      productName VARCHAR(255),
      category VARCHAR(255),
      shortDescription TEXT,
      detailedDescription TEXT,
      benefits LONGTEXT,
      images LONGTEXT,
      videos LONGTEXT,
      howToEat TEXT,
      howToStore TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  seo_keywords: `
    CREATE TABLE IF NOT EXISTS seo_keywords (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      keywords VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  cart: `
    CREATE TABLE IF NOT EXISTS cart (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(50) NOT NULL,
      productId VARCHAR(50) NOT NULL,
      name VARCHAR(255),
      category VARCHAR(255),
      price DECIMAL(10,2),
      quantity INT DEFAULT 1,
      image LONGTEXT,
      selectedWeight VARCHAR(50),
      weights TEXT,
      prices TEXT,
      docId VARCHAR(100) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  favorites: `
    CREATE TABLE IF NOT EXISTS favorites (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(50) NOT NULL,
      productId VARCHAR(50) NOT NULL,
      name VARCHAR(255),
      price DECIMAL(10,2),
      image LONGTEXT,
      selectedWeight VARCHAR(50),
      weights TEXT,
      prices TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_fav (userId, productId),
      INDEX (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  user_addresses: `
    CREATE TABLE IF NOT EXISTS user_addresses (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      fullname VARCHAR(255),
      email VARCHAR(255),
      contact VARCHAR(50),
      zip VARCHAR(20),
      city VARCHAR(100),
      state VARCHAR(100),
      street TEXT,
      country VARCHAR(100) DEFAULT 'India',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  coupons: `
    CREATE TABLE IF NOT EXISTS coupons (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      discountType VARCHAR(20) DEFAULT 'percentage',
      discountValue DECIMAL(10,2) NOT NULL,
      minPurchase DECIMAL(10,2) DEFAULT 0,
      expiryDate DATE,
      usageLimit INT DEFAULT 0,
      usedCount INT DEFAULT 0,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `
};

module.exports = tables;
