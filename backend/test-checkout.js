const axios = require('axios');

// run this after signing in as a user or admin and having items in cart
(async () => {
  try {
    // create a new user to test (skip if already registered)
    const email = 'testuser@example.com';
    const password = 'Password123!';

    await axios.post('http://localhost:5000/api/auth/register', {
      firstName: 'Test',
      lastName: 'User',
      email,
      password,
      line1: '1 Test Road',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland'
    }).catch(() => {}); // ignore error if user exists

    const login = await axios.post('http://localhost:5000/api/auth/signin', {
      email,
      password
    });
    const token = login.data.token;
    console.log('✓ Signed in');

    // use product 6 we just created
    const productId = 6;

    // add a cart item
    await axios.post(
      'http://localhost:5000/api/cart/add',
      { productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const res = await axios.post(
      'http://localhost:5000/api/checkout',
      { shippingAddress: '123 Test St' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('checkout response', res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
})();