const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'RegisterTest',
        email: 'registertest2@example.com',
        phone: '9999999999',
        password: 'Test@1234'
      }),
    });
    const body = await res.text();
    console.log('status', res.status);
    console.log('body', body);
  } catch (error) {
    console.error('error', error.message);
  }
})();
