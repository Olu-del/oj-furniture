const app = require('./app');

// Load environment variables from .env file
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});