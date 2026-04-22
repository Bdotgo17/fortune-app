const FORTUNES = [
  "A surprise encounter will bring you joy.",
  "Soon you will make a valuable connection.",
  "An unexpected opportunity will present itself.",
  "Trust your instincts this week.",
  "A small risk will bring a large reward.",
  "You will find clarity in an unlikely place.",
  "A short trip will change your perspective.",
  "A new hobby will bring lasting happiness.",
  "Someone admires your dedication.",
  "You will rediscover an old passion.",
];

function seededFortune(seed) {
  // deterministic selection based on provided seed
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = Math.abs(h) % FORTUNES.length;
  return FORTUNES[idx];
}

module.exports = { FORTUNES, seededFortune };
