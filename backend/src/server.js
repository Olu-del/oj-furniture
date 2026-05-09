// entry point - boot up the Express app
const app = require('./app');

// Port for the server to listen on
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
