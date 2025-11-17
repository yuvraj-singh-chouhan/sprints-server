import { Request, Response, NextFunction, Application, Router } from "express";

import ProductController from "./Controller";
import Auth from "../../services/middlewares/auth";
import Validator from "./Validator";

export default function (app: Application) {
  const router: Router = Router();

  router.post('/product/create', Validator.validateCreateProduct, Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.createProduct();
  });

  router.post("/product/update/:id", Validator.validateUpdateProduct, Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.updateProduct();
  })

  router.post("/product/listing", Validator.validateProductListing, async(req: Request, res: Response, next: NextFunction) =>{
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.productListing();
  })

  router.get("/product/:id", async (req: Request, res: Response, next: NextFunction) => {
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.productDetails();
  })

  return router;
}
