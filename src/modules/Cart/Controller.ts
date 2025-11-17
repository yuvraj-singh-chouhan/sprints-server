import { NextFunction, Request, Response } from "express";
import BaseController from "../Base/Controller";
import { Attributes } from "sequelize";
import { db } from "../../config/sequelize";
import CommonService from "../../services/Global/common";
import { HTTP_CODE } from "../../services/Global/constant";
import { CartService } from "./Service";

const { CartItem } = db;

class CartController extends BaseController{
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async addToCart() {
    try {
      const data = this.req.body;
      const processableBody: string[] = [
        "productId",
        "SKU"
      ]
      const processedbody = CommonService.processBody(processableBody, this.req.body);
      const response: Attributes<InstanceType<typeof CartItem>> |  [affectedCount: number] | null = await new CartService(this.req).handleCart(processedbody);
      CommonService.handleResponse(this.res, "", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response)
    } catch (error) {
      this.next(error);
    }
  }

  async getCartDetails(){
    try {
      const response: Attributes<InstanceType<typeof CartItem>>[] | [] | null = await new CartService(this.req).handleCartDetails();
      CommonService.handleResponse(this.res, "", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response)
    } catch (error) {
      this.next(error);
    }
  }
}

export { CartController };