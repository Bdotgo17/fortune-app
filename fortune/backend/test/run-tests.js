const axios = require("axios");
const http = require("http");

(async function run() {
  try {
    // start a simple in-memory server by requiring the app
    const server = require("../src/index");
  } catch (err) {
    // index.js runs the server directly; tests should instead call endpoints.
  }

  const base = "http://localhost:4000";

  console.log(
    "This test assumes you started the backend with `npm run dev` on port 4000.",
  );
  console.log("Manual test:");
  console.log("1) POST /api/create-checkout -> get checkoutId and checkoutUrl");
  console.log("2) Visit checkoutUrl and complete simulated payment");
  console.log("3) POST /api/fortune with { checkoutId } -> expect fortune");

  process.exit(0);
})();
