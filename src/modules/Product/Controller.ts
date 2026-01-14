import { NextFunction, Request, Response } from "express";
import BaseController from "../Base/Controller";
import CommonService from "../../services/Global/common";
import ProductService from "./Service";
import { Attributes } from "sequelize";
import { db } from "../../config/sequelize";
import { HTTP_CODE } from "../../services/Global/constant";

const { Product, ProductItem } = db;

export default class ProductController extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  /**
   * Create product
   * @returns 
   */
  async createProduct() {
    try {
      const data = this.req.body;
      const processableBody: string[] = [
        "name",
        "description",
        "price",
        "salePrice",
        "vendor_id",
        "category_id",
        "isDeleted",
        "status",
        "createdBy",
        "meta_title",
        "meta_description",
        "meta_keywords",
        "url_slug",
        "quantity",
        "variant_ids",
        "variant_template_id",
        "_id"
      ]
      const processedbody = CommonService.processBody(processableBody, data);
      const response: Attributes<InstanceType<typeof ProductItem>> | null = await new ProductService(this.req).addProduct(processedbody);
      CommonService.handleResponse(this.res, "", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response)
    } catch (error) {
      this.next(error);
    }
  }

  async productListing() {
    try {
      const processableBody: string[] = [
        "page",
        "pageSize",
        "filters"
      ];

      const processedbody = CommonService.processBody(processableBody, this.req.body);
      const response: Attributes<InstanceType<typeof Product>>[] | [] = await new ProductService(this.req).listing(processedbody);
      CommonService.handleResponse(this.res, "", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response)
    } catch (error) {
      this.next(error);
    }
  }

  async updateProduct() {
    try {
      const processBody = ["SKU", "category_id", "_id"];
      const processedData = CommonService.processBody(processBody, this.req.body);
      const response: [affectedCount: number] | Error = await new ProductService(this.req).handleUpdateProduct(processedData);
      CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      this.next(error);
    }
  }


  async productDetails() {
    try {
      const { id } = this.req.params;
      console.log("id", id)
      const response: Attributes<InstanceType<typeof Product>> | null = await new ProductService(this.req).handleProductDetails(id);
      console.log(response);
      CommonService.handleResponse(this.res, "SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      this.next(error);
    }
  }
}