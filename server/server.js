require("dotenv").config();

// Database connection
require("./config/db");

// Import the Express app
const app = require("./app");

const PORT = process.env.PORT || 5000;

console.log("🔥 SERVER.JS STARTED");

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});