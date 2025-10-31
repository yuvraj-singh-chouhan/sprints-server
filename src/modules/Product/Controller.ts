import { NextFunction, Request, Response } from "express";
import BaseController from "../Base/Controller";
import CommonService from "../../services/Global/common";
import ProductService from "./Service";
import { Attributes } from "sequelize";
import { db } from "../../config/sequelize";

const { Product } = db;

export default class ProductController extends BaseController<Request> {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  /**
   * Create product
   * @returns 
   */
  async createProduct() {
    const data = this.req.body;
    const processableBody: string[] = [
      "name",
      "sku",
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
      "variant_ids",
      "variant_template_id",     
    ]
    const processedbody = CommonService.processBody(processableBody, this.req.body);
    const response: Attributes<typeof Product> | null = await new ProductService(this.req).addProduct(processedbody);
  }
}