import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import CommonService from "../../services/Global/common";
import { HTTP_CODE } from "../../services/Global/constant";

class Validator{

  static async validateCreateCategory(req: Request, res: Response, next: NextFunction): Promise<void>{
    const schema = Joi.object({
      title: Joi.string().required(),
      parentCategory_id: Joi.string(),
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
      CommonService.handleResponse(res, error.message, HTTP_CODE.UNPROCESSABLE_ENTITY, false);
      return;
    }
    req.body = value;
    next();
  }

  static async validateCategoryListing(req: Request, res: Response, next: NextFunction): Promise<void>{
    const schema = Joi.object({
      page: Joi.number().integer().required().min(1),
      pageSize: Joi.number().integer().required().min(1),
      searchText: Joi.string(),
      filters: Joi.array()
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
      CommonService.handleResponse(res, error.message, HTTP_CODE.UNPROCESSABLE_ENTITY, false);
      return;
    }
    req.body = value;
    next();
  }

  static async validateUpdateCategory(req: Request, res: Response, next: NextFunction): Promise<void>{
    const schema = Joi.object({
      status: Joi.boolean(),
      title: Joi.string(),
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
