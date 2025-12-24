import { Application, NextFunction, Request, Response, Router } from "express";
import { WishListController } from "./Controller";
import Auth from "../../services/middlewares/auth";

export default (app: Application) => {
  const router = Router();

  router.post("/wishlist", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const cartObj = new WishListController(req, res, next);
    await cartObj.addToWishList();
  })

  router.get("/wishlist", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const cartObj = new WishListController(req, res, next);
    await cartObj.getWishListDetails();
  })

  router.post("/wishlist/remove", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const cartObj = new WishListController(req, res, next);
    await cartObj.removeItemFromWishList();
  });

  return router;
}