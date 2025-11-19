import * as Joi from "joi";
import CommonService from "../../services/Global/common";
import { NextFunction, Request, Response } from "express";
import { HTTP_CODE } from "../../services/Global/constant";

class Validator{

  /**
   * Validate create role request
   * @param req request object
   * @param res response object
   * @param next next function
   * @returns void
   */
  static async validateCreateRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    const schema =  Joi.object({
      title: Joi.string().required(),
      permissions: Joi.array().required().items(Joi.string()),
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
      CommonService.handleResponse(res, error.message, HTTP_CODE.UNPROCESSABLE_ENTITY, false);
      return;
    }
    req.body = value;
    next();
  }

  /**
   * Validate get roles request
   * @param req request object
   * @param res response object
   * @param next next function
   * @returns void
   */
  static async validateGetRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    const schema =  Joi.object({
      page: Joi.number().integer().required().min(1),
      pageSize: Joi.number().integer().required().min(1),
      searchText: Joi.string(),
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
      CommonService.handleResponse(res, error.message, HTTP_CODE.UNPROCESSABLE_ENTITY, false);
      return;
    }
    req.body = value;
    next();
  }

  /**
   * Validate update role request
   * @param req request object
   * @param res response object
   * @param next next function
   * @returns void
   */
  static async validateUpdateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const schema =  Joi.object({
      title: Joi.string().required(),
      permissions: Joi.array().required(),
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
      CommonService.handleResponse(res, error.message, HTTP_CODE.UNPROCESSABLE_ENTITY, false);
      return;
    }
    req.body = value;
    next();
  }
}

export default Validator;
