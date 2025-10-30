import { Request, Response, NextFunction, Application, Router } from "express";

import  ProductController from "./Controller"; 
import Auth from "../../services/middlewares/auth";
import { RequestType } from "../../types/requestTypes";

export default function(app: Application){
  const router: Router = Router();

  router.post('/product/create', Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const productCtrl = new ProductController(req, res, next);
    await productCtrl.createProduct();
  });

  return router;
}
