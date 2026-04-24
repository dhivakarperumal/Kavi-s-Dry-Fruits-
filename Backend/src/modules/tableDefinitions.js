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
      docId VARCHAR(200),
      name VARCHAR(255),
      image LONGTEXT,
      price DECIMAL(10,2),
      quantity INT,
      weight VARCHAR(50),
      selectedWeight VARCHAR(100),
      weights LONGTEXT,
      prices LONGTEXT,
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
      discountType VARCHAR(50),
      discountValue DECIMAL(10,2),
      minPurchase DECIMAL(10,2),
      usageLimit INT,
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
      area VARCHAR(255),
      pincode VARCHAR(10),
      lat DECIMAL(10, 8),
      lng DECIMAL(11, 8),
      distance DECIMAL(10, 2),
      delivery_charge DECIMAL(10,2),
      delivery_days INT,
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
  order_items: `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(100),
      product_id VARCHAR(100),
      name VARCHAR(255),
      image TEXT,
      quantity INT,
      price DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  order_tracking: `
    CREATE TABLE IF NOT EXISTS order_tracking (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(100),
      status VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  delivery_agents: `
    CREATE TABLE IF NOT EXISTS delivery_agents (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  delivery_locations: `
    CREATE TABLE IF NOT EXISTS delivery_locations (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(100),
      agent_id INT,
      lat DECIMAL(10, 8),
      lng DECIMAL(11, 8),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
      dealerName VARCHAR(255),
      invoiceDate DATE,
      invoiceValue DECIMAL(15,2),
      invoiceGSTValue DECIMAL(15,2),
      invoiceTotalValue DECIMAL(15,2),
      transportAmount DECIMAL(15,2),
      billPdfBase64 LONGTEXT,
      billPdfName VARCHAR(255),
      items JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  stock_history: `
    CREATE TABLE IF NOT EXISTS stock_history (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50),
      productName VARCHAR(255),
      productCategory VARCHAR(255),
      type VARCHAR(50),
      changeAmount INT,
      addedQuantity INT,
      finalStock INT,
      invoiceNumber VARCHAR(100),
      action VARCHAR(50),
      timestamp DATETIME DEFAULT NULL,
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
  seo_keywords: `
    CREATE TABLE IF NOT EXISTS seo_keywords (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      keywords TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  `,
  site_settings: `
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE,
      setting_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  reviews: `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      reviewId VARCHAR(50) NOT NULL UNIQUE,
      userId VARCHAR(36),
      orderId VARCHAR(100),
      userName VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      rating DECIMAL(3,1) DEFAULT 0,
      image LONGTEXT,
      selected TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  user_addresses: `
    CREATE TABLE IF NOT EXISTS user_addresses (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
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
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  sticker_records: `
    CREATE TABLE IF NOT EXISTS sticker_records (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(50),
      weight VARCHAR(50),
      price DECIMAL(10,2),
      barcode LONGTEXT,
      packingDate DATE,
      printQty INT,
      totalStickers INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  order_tracking: `
    CREATE TABLE IF NOT EXISTS order_tracking (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      description TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  delivery_locations: `
    CREATE TABLE IF NOT EXISTS delivery_locations (
      order_id VARCHAR(100) NOT NULL PRIMARY KEY,
      agent_id INT,
      lat DECIMAL(10,8),
      lng DECIMAL(11,8),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `,
  delivery_agents: `
    CREATE TABLE IF NOT EXISTS delivery_agents (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `
};

module.exports = tables;
