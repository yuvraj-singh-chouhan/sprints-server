import { Request, Response, NextFunction } from "express";
import { JwtPayloadType, RequestType } from "../../types/requestTypes";
import CommonService from "../Global/common";
import { HTTP_CODE } from "../Global/constant";
import Service from "../../modules/Users/Service";


class Auth{
  static async isAuthorized(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const token = req.headers.authorization;
      if(!token){
        CommonService.handleResponse(res, "TOKEN_REQUIRED", HTTP_CODE.UNAUTHORIZED_CODE, HTTP_CODE.FAILED);
        return
      }
      const decodedToken: JwtPayloadType = await Service.verifyToken(token);
      if(!decodedToken && typeof decodedToken == "string"){
        CommonService.handleResponse(res, "INVALID_TOKEN", HTTP_CODE.UNAUTHORIZED_CODE, HTTP_CODE.FAILED);
        return;
      }
      req.currentUser = decodedToken;
      next();
    } catch (error) {
      console.log("Error in isAuthorized", error);
      CommonService.handleResponse(res, "INVALID_TOKEN", HTTP_CODE.UNAUTHORIZED_CODE, HTTP_CODE.FAILED)
      return;
    }
  }
}

export default Auth;
