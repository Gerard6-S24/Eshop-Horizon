import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import bundlesRouter from "./bundles";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import contactRouter from "./contact";
import checkoutRouter from "./checkout";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(bundlesRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(contactRouter);
router.use(checkoutRouter);

export default router;
