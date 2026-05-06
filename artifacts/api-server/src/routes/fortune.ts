import { Router, type IRouter } from "express";

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
  "Your persistence will be rewarded soon.",
  "A kind word today will return tenfold tomorrow.",
  "Something lost will find its way back to you.",
  "The answer you seek is closer than you think.",
  "A creative spark will ignite something wonderful.",
];

const router: IRouter = Router();

router.get("/fortune/reveal", (req, res) => {
  const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  res.json({ fortune });
});

export default router;
