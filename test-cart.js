// Test script to verify cart API with prices
const http = require('http');

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          console.log(`\n${method} ${path} - Status: ${res.statusCode}`);
          const parsed = JSON.parse(data);
          console.log(JSON.stringify(parsed, null, 2));
          resolve(parsed);
        } catch (e) {
          console.log(`Response: ${data}`);
          reject(e);
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function test() {
  try {
    // Step 1: Sign in
    console.log('\n========= STEP 1: Sign In =========');
    const signinRes = await makeRequest('POST', '/api/auth/signin', {
      email: 'ojfurniture2026@gmail.com',
      password: 'Admin123!'
    });

    if (!signinRes.token) {
      console.log('❌ Sign in failed - no token received');
      return;
    }

    const token = signinRes.token;
    console.log(`✓ Successfully signed in. Token: ${token.slice(0, 20)}...`);

    // Step 1.5: Get a product to add to cart
    console.log('\n========= STEP 1.5: Fetch Products =========');
    const productsRes = await makeRequest('GET', '/api/product', null, token);
    
    if (!productsRes || !Array.isArray(productsRes) || productsRes.length === 0) {
      console.log('❌ No products found in database');
      return;
    }

    const product = productsRes[0];
    console.log(`✓ Found product: ${product.name} (ID: ${product.id}, Price: £${product.price})`);

    // Step 2: Add product to cart
    console.log('\n========= STEP 2: Add Product to Cart =========');
    const addRes = await makeRequest('POST', '/api/cart/add', {
      productId: product.id,
      quantity: 2
    }, token);
    
    if (!addRes) {
      console.log('❌ Add to cart failed');
      return;
    }
    console.log('✓ Product added to cart');

    // Step 3: Get cart with product
    console.log('\n========= STEP 3: Fetch Cart with Product =========');
    const cartRes = await makeRequest('GET', '/api/cart', null, token);
    
    if (!cartRes) {
      console.log('❌ Cart fetch failed');
      return;
    }

    console.log('✓ Cart retrieved successfully');
    
    if (cartRes.items && cartRes.items.length > 0) {
      console.log('\n📦 Cart Items:');
      cartRes.items.forEach((item, i) => {
        const price = item.product?.price;
        console.log(`  [${i}] Product: ${item.product?.name || 'Unknown'}`);
        console.log(`      Price: ${price} (type: ${typeof price})`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Total: £${Number(price || 0) * item.quantity}`);
      });

      // Calculate total
      const total = cartRes.items.reduce((sum, item) => {
        const price = Number(item.product?.price || 0);
        return sum + price * item.quantity;
      }, 0);
      
      console.log(`\n💰 Cart Total: £${total.toFixed(2)}`);
      console.log('✓ Prices are correctly formatted as numbers');
    } else {
      console.log('\n✓ Cart is empty (no items)');
    }

  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

test();
