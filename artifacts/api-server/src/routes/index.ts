import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fortuneRouter from "./fortune";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fortuneRouter);

export default router;
