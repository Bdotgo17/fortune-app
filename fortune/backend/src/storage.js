const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "purchases.json");
let store = {};

function load() {
  try {
    if (fs.existsSync(FILE)) {
      const raw = fs.readFileSync(FILE, "utf8");
      store = raw ? JSON.parse(raw) : {};
    } else {
      store = {};
    }
  } catch (err) {
    console.warn("Failed to load purchases.json, starting empty", err);
    store = {};
  }
}
function save() {
  try {
    fs.writeFileSync(FILE, JSON.stringify(store, null, 2), {
      encoding: "utf8",
    });
  } catch (err) {
    console.error("Failed to write purchases.json", err);
  }
}

load();

module.exports = {
  get(checkoutId) {
    return store[checkoutId] || null;
  },
  set(checkoutId, value) {
    store[checkoutId] = value;
    save();
    return store[checkoutId];
  },
  all() {
    return { ...store };
  },
  remove(checkoutId) {
    delete store[checkoutId];
    save();
  },
};
