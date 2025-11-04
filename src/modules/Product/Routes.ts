import { Request, Response, NextFunction, Application, Router } from "express";

import ProductController from "./Controller";
import Auth from "../../services/middlewares/auth";

export default function (app: Application) {
  const router: Router = Router();

  router.post('/product/create', Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.createProduct();
  });

  router.post("/product/update/:id", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.updateProduct();
  })

  router.get("/product/:id", async (req: Request, res: Response, next: NextFunction) => {
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.productListing();
  })

  return router;
}
