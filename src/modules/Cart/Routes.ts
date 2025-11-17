import { Application, NextFunction, Request, Response, Router } from "express";
import { CartController } from "./Controller";
import Auth from "../../services/middlewares/auth";

export default (app: Application) => {
  const router = Router();

  router.post("/cart", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const cartObj = new CartController(req, res, next);
    await cartObj.addToCart();
  })

  router.get("/cart", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const cartObj = new CartController(req, res, next);
    await cartObj.getCartDetails();
  })
  return router;
}