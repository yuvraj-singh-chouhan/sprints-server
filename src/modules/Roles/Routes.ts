import { Application, Request, Router, Response, NextFunction } from "express";
import RoleController from "./Controller";
import Auth from "../../services/middlewares/auth";
import Validator from "./Validator";

export default function(app: Application){
  const router = Router();

  router.post('/roles/add', Validator.validateCreateRoles, Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const roleObj: RoleController = new RoleController(req, res, next);
    await roleObj.createRole();
  });

  router.post("/roles", Validator.validateGetRoles, Auth.isAuthorized, async( req: Request, res: Response, next: NextFunction) =>{
    const roleObj: RoleController = new RoleController(req, res, next);
    await roleObj.getRoleListing();
  })

  router.post("/roles/update/:roleId", Validator.validateUpdateRole, Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const roleObj: RoleController = new RoleController(req, res, next);
    await roleObj.updateRole();
  })

  router.delete("/roles/delete/:roleId", Auth.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
    const roleObj: RoleController = new RoleController(req, res, next);
    await roleObj.deleteRole();
  })

  return router;
}