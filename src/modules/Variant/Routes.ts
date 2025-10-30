import { Application, Router, Request, Response, NextFunction } from "express";
import Auth from "../../services/middlewares/auth";
import VariantController from "./Controller";
import { RequestType } from "../../types/requestTypes";

export default function(app: Application){
  const router: Router = Router()


  /**
   * Variant template routes
   */
  router.post("/variant-template", Auth.isAuthorized, async ( req: Request, res: Response, next: NextFunction) => {
    const variantTemplateObj = new VariantController(req, res, next);
    await variantTemplateObj.addVariantTemplate();
  })

  router.get("/variant-template/listing", Auth.isAuthorized, async ( req: Request, res: Response, next: NextFunction) => {
    const variantObj = new VariantController(req, res, next);
    await variantObj.variantTemplateListing();
  })

  /**
   * variant Routes
   */

  // Add Variant
  router.post("/variant", Auth.isAuthorized, async ( req: Request, res: Response, next: NextFunction) => {
    const variantObj = new VariantController(req, res, next);
    await variantObj.addVariant();
  })

  // get router listing
  router.get("/variant/listing", Auth.isAuthorized, async ( req: Request, res: Response, next: NextFunction) => {
    const variantObj = new VariantController(req, res, next);
    await variantObj.variantListing();
  })

  return router;
}