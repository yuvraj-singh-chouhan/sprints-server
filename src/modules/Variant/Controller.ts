import { NextFunction, Request, Response } from "express";
import { Attributes, InferAttributes, Model } from "sequelize";

import BaseController from "../Base/Controller";
import CommonService from "../../services/Global/common";
import Service from "./Service";
import { HTTP_CODE } from "../../services/Global/constant";
import { db } from "../../config/sequelize";

const { Variant, VariantTemplate } = db;

class Controller extends BaseController<Request> {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  /**
   * Handle add variant Template
   *
   */
  async addVariantTemplate() {
    try {
      const processBody = ["title", "category_id"];
      const processedData = CommonService.processBody(processBody, this.req.body);
      const response: Attributes<InstanceType<typeof VariantTemplate>> | Error = await new Service().handleAddVariantTemplate(processedData);
      CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      this.next(error);
    }
  }

  /** ?
   * Handler Variant details
  */

  async variantTemplateListing() {
    try {
      const processBody = ['page', 'pageSize', "filter"];
      const processedData = CommonService.processBody(processBody, this.req.query);
      const response: Attributes<InstanceType<typeof VariantTemplate>>[] | [] = await new Service().handleVariantTemplateListing(processedData);
      CommonService.handleResponse(this.res, 'SUCCESS', HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      this.next(error);
    }
  }

  async updateVarintTemplate() {
    try {
      const processBody = ["title", "category_id", "_id"];
      const processedData = CommonService.processBody(processBody, this.req.body);
      const response: Attributes<InstanceType<typeof VariantTemplate>> | Error = await new Service().handleUpdateVariantTemplate(processedData);
      CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      this.next(error);
    }
  }

  async addVariant() {
    try {
      const processBody = ["title", "variant_template_id"];
      const processedData = CommonService.processBody(processBody, this.req.body);
      const response: Attributes<InstanceType<typeof Variant>> | Error = await new Service().handleAddVariant(processedData);
      CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      this.next(error);
    }
  }

  async variantListing() {
    try {
      const processBody = ["page", "pageSize", "filter"];
      const processdata = CommonService.processBody(processBody, this.req.query);
      const response: Attributes<InstanceType<typeof Variant>>[] | [] = await new Service().handleVariantListing(processdata);
      CommonService.handleResponse(this.res, 'SUCCESS', HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      this.next(error);
    }
  }
}

export default Controller;