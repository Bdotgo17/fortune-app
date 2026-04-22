const crypto = require("crypto");

function verifyHmac(rawBody, hmacHeader, secret) {
  if (!secret || !hmacHeader) return false;
  const bodyBuf = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(String(rawBody), "utf8");
  const computed = crypto
    .createHmac("sha256", secret)
    .update(bodyBuf)
    .digest("base64");
  try {
    const a = Buffer.from(computed, "base64");
    const b = Buffer.from(hmacHeader, "base64");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

module.exports = { verifyHmac };
