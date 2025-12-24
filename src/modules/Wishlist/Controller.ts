import { NextFunction, Request, Response } from "express";
import BaseController from "../Base/Controller";
import { Attributes } from "sequelize";
import { db } from "../../config/sequelize";
import CommonService from "../../services/Global/common";
import { HTTP_CODE } from "../../services/Global/constant";
import { WishListService } from "./Service";

const { WishlistItem } = db;

class WishListController extends BaseController{
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async addToWishList() {
    try {
      const processableBody: string[] = [
        "productId",
        "SKU"
      ]
      const processedbody = CommonService.processBody(processableBody, this.req.body);
      const response: Attributes<InstanceType<typeof WishlistItem>> |  [affectedCount: number] | null = await new WishListService(this.req).handleWishList(processedbody);
      CommonService.handleResponse(this.res, "", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response)
    } catch (error) {
      this.next(error);
    }
  }

  async removeItemFromWishList() {
    try{
      const processableBody: string[] =["productId", "wishlistId", "_id"];
      const processedbody = CommonService.processBody(processableBody, this.req.body);
      const response: number | null = await new WishListService(this.req).removeItemFromWishList(processedbody);
      CommonService.handleResponse(this.res, "", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    }catch(error){
      this.next(error);
    }
  }

  async getWishListDetails(){
    try {
      const response: Attributes<InstanceType<typeof WishlistItem>>[] | [] | null = await new WishListService(this.req).handleWishListDetails();
      CommonService.handleResponse(this.res, "", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response)
    } catch (error) {
      this.next(error);
    }
  }
}

export { WishListController };