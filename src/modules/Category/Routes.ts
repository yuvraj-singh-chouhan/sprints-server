import { Request, Response, NextFunction, Application, Router } from "express";
import CategoryController from "./Controller";
import Validator from "./Validator";
import Auth from "../../services/middlewares/auth";

export default function(app: Application){
  const router: Router = Router();

  router.post('/category/add', Auth.isAuthorized, Validator.validateCreateCategory, async (req: Request, res: Response, next: NextFunction) => {
    const categoryObj: CategoryController = new CategoryController(req, res, next);
    await categoryObj.addCategory();
  });

  router.post("/category/listing", Validator.validateCategoryListing, async (req: Request, res: Response, next: NextFunction) => {
    const categoryObj: CategoryController = new CategoryController(req, res, next);
    await categoryObj.categoryListing();
  })

  router.post("/category/update/:id", Auth.isAuthorized, Validator.validateUpdateCategory, async (req: Request, res: Response, next: NextFunction) => {
    const categoryObj: CategoryController = new CategoryController(req, res, next);
    await categoryObj.updateCategory();
  })

  router.delete("/category/delete/:id", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const categoryObj: CategoryController = new CategoryController(req, res, next);
    await categoryObj.deleteCategory();
  })

  router.post("/", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const categoryObj: CategoryController = new CategoryController(req, res, next);
    await categoryObj.getCategories();
  })
  return router;
}
