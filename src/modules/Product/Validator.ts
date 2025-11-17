import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import CommonService from "../../services/Global/common";
import { HTTP_CODE } from "../../services/Global/constant";

class Validator {

  static async validateCreateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    const schema = Joi.object({
      name: Joi.string().required(),
      SKU: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.string().required(),
      salePrice: Joi.string().required(),
      vendor_id: Joi.string().required(),
      category_id: Joi.string().required(),
      isDeleted: Joi.boolean(),
      status: Joi.string(),
      createdBy: Joi.string().required(),
      meta_title: Joi.string().required(),
      meta_description: Joi.string().required(),
      meta_keywords: Joi.string().required(),
      url_slug: Joi.string().required(),
      variant_ids: Joi.array(),
      variant_template_id: Joi.string(),
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
      CommonService.handleResponse(res, error.message, HTTP_CODE.UNPROCESSABLE_ENTITY, false);
      return;
    }
    req.body = value;
    next();
  }

  static async validateProductListing(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  static async validateUpdateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    const schema = Joi.object({
      name: Joi.string().required(),
      SKU: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.string().required(),
      salePrice: Joi.string().required(),
      vendor_id: Joi.string().required(),
      category_id: Joi.string().required(),
      isDeleted: Joi.boolean(),
      status: Joi.string(),
      createdBy: Joi.string().required(),
      meta_title: Joi.string().required(),
      meta_description: Joi.string().required(),
      meta_keywords: Joi.string().required(),
      url_slug: Joi.string().required(),
      variant_ids: Joi.array(),
      variant_template_id: Joi.string(),
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
