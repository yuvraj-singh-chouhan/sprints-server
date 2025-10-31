import { NextFunction, Request, Response } from "express";
import { Attributes, InferAttributes, Model } from "sequelize";

import BaseController from "../Base/Controller";
import CommonService from "../../services/Global/common";
import Service from "./Service";
import { HTTP_CODE } from "../../services/Global/constant";
import { db } from "../../config/sequelize";

const { Variant, VariantTemplate } = db;

class Controller extends BaseController<Request>{
  constructor(req: Request, res: Response, next: NextFunction){
    super(req, res, next);
  }

  /**
   * Handle add variant Template
   *
   */
  async addVariantTemplate(){
    const processBody = ["title", "category_id"];
    const processedData = CommonService.processBody(processBody, this.req.body);
    const response: Model<typeof VariantTemplate> | Error = await new Service().handleAddVariantTemplate(processedData);
    return CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
  }

  /** ?
   * Handler Variant details
  */

  async variantTemplateListing(){
    const processBody = ['page', 'pageSize', "filter"];
    const processedData = CommonService.processBody(processBody, this.req.query);
    const response: Attributes< typeof VariantTemplate>[] | [] = await new Service().handleVariantTemplateListing(processedData);
    return CommonService.handleResponse(this.res, 'SUCCESS', HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
  }

  async updateVarintTemplate(){
    const processBody = ["title", "category_id", "_id"];
    const processedData = CommonService.processBody(processBody, this.req.body);
    const response: Attributes< typeof VariantTemplate> | Error = await new Service().handleUpdateVariantTemplate(processedData);
    return CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
  }

  async addVariant(){
    const processBody = ["title", "variant_template_id"];
    const processedData = CommonService.processBody(processBody, this.req.body);
    const response: Attributes< typeof Variant> | Error = await new Service().handleAddVariant(processedData);
    return CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
  }

  async variantListing(){
    const processBody = ["page", "pageSize", "filter"];
    const processdata = CommonService.processBody(processBody, this.req.query);
    const response: Attributes<typeof Variant>[] | [] = await new Service().handleVariantListing(processdata);
    return CommonService.handleResponse(this.res, 'SUCCESS', HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
  }
}

export default Controller;