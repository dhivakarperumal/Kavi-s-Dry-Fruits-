const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin@123' }),
    });
    const text = await res.text();
    console.log('status', res.status);
    console.log('body', text);
  } catch (error) {
    console.error('error', error.message);
  }
})();
