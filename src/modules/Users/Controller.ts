import { Request, Response, NextFunction } from "express";
import BaseController from "../Base/Controller";
import { User } from "./Model";
import CommonService from "../../services/Global/common";
import { HTTP_CODE } from "../../services/Global/constant";
import Service from "./Service";
import { InferAttributes } from "sequelize";
import { Role } from "../Roles/Model";

class UserController extends BaseController<Request>{
  constructor(req: Request, res: Response, next: NextFunction){
    super(req, res, next);
  }


  /***************************************************
   * Reset Password Controller 
   * @body {
   *    fullName: string
   *    email: string
   *    deviceId: string
   *    password: string
   *    gender: string
   *    age: string
   *    mobile: string
   * }
   * @returns 
   **************************************************/

  async login() {
    try {
      const processBody = ["email", "password", "deviceId"];
      const processedData = CommonService.processBody(processBody, this.req.body);
      const user: User | null = await User.findOne({ where: { email: processedData.email, isDeleted: false }, include: Role, attributes: { exclude: ["password"]} });
      if (!user) {
        return CommonService.handleResponse(this.res, "USER_NOT_FOUND", HTTP_CODE.NOT_FOUND_CODE, HTTP_CODE.FAILED);
      }

      const userTokens = await Service.createLogin(user.dataValues, processedData.deviceId)

      if(!userTokens.token){
        return CommonService.handleResponse(this.res, "LOGIN_FAILED",HTTP_CODE.SERVER_ERROR_CODE, HTTP_CODE.FAILED);
      }
      let userResponse = {
        ...user.dataValues,
        token: userTokens.token,
        deviceId: userTokens.deviceId
      }
      CommonService.handleResponse(this.res, "LOGIN_SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, userResponse);

    } catch (error) {
      console.log("Error in login", error);
      this.res.send({status: false, message: error});
    }
  }


  /***************************************************
   * Reset Password Controller 
   * @body {
   *    fullName: string
   *    email: string
   *    password: string
   *    gender: string
   *    age: string
   *    mobile: string
   * }
   * @returns 
   **************************************************/

  async register() {
    try{
      const data = this.req.body;

      const processBody = [
        "fullName",
        "email",
        "password",
        "age",
        "gender",
        "mobile",
      ]

      const processedData = CommonService.processBody(processBody, data);
      const user: User | null = await User.findOne({ where: { email: processedData.email, isDeleted: false } });
      if(user){
        return CommonService.handleResponse(this.res, "USER_EXIST", HTTP_CODE.CONFLICT_CODE, HTTP_CODE.FAILED);
      }

      const newUser: InferAttributes<User> | null = await Service.registerUser(processedData);
      if(newUser){
        return CommonService.handleResponse(this.res, "CREATED_SUCCESSFULLY", HTTP_CODE.RESOURCE_CREATED_CODE, HTTP_CODE.SUCCESS);
      }
      CommonService.handleResponse(this.res, "FAILED_TO_CREATE_USER", HTTP_CODE.SERVER_ERROR_CODE, HTTP_CODE.FAILED);
    }catch(error){
      console.log("Error in register", error);
      this.next(error);
    }
  }

  async profile(){
    CommonService.handleResponse(this.res, "USER_NOT_FOUND", HTTP_CODE.NOT_FOUND_CODE, HTTP_CODE.FAILED)
  }


  /**************************************************
   * Reset Password Controller
   * @body {
   *    email: string
   * }
   * @returns
   **************************************************/

  async forgetPassword(){
    const { email } = this.req.body;

    const user: User | null = await User.findOne({where: {email, isDeleted: false, status: true}, raw: true});

    if(!user){
      return CommonService.handleResponse(this.res, "USER_NOT_FOUND", HTTP_CODE.CONFLICT_CODE, HTTP_CODE.FAILED)
    }

    const forgotPasswordToken = await Service.generateForgotPasswordToken(user);

    if(forgotPasswordToken){
      return CommonService.handleResponse(this.res, "FORGET_PASSWORD_SENT", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, forgotPasswordToken);
    }

    CommonService.handleResponse(this.res, "FORGET_PASSWORD_SENT", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS);
  }

  /***************************************************
   * Reset Password Controller 
   * @body
   * {
   *    newPassword: string
   *    confirmPassword: string
   * }
   * @returns 
   **************************************************/
  async resetPassword(){
    const token = this.req.query.resetToken?.toString().trim();
    const { newPassword, confirmPassword } = this.req.body;

    if(!token){
      return CommonService.handleResponse(this.res, "CONFIRM_PASSWORD_NOT_MATCHED", HTTP_CODE.UNPROCESSABLE_ENTITY, HTTP_CODE.FAILED)
    }
    if(newPassword !== confirmPassword){
      return CommonService.handleResponse(this.res, "CONFIRM_PASSWORD_NOT_MATCHED", HTTP_CODE.UNPROCESSABLE_ENTITY, HTTP_CODE.FAILED)
    }

    const authData = await Service.checkResetTokenExpiration(token);

    if(authData && typeof authData !== "string"){
      const [affectedCount, affectedRows] = await User.update({
        password: newPassword
      }, { where: { _id: authData._id },individualHooks: true, returning: true});

      if(affectedCount && affectedRows[0]){
        return CommonService.handleResponse(this.res, "PASSWORD_RESET_SUCCESS", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS)
      }
    }
    CommonService.handleResponse(this.res, "PASSWORD_RESET_TOKEN_EXPIRED", HTTP_CODE.UNPROCESSABLE_ENTITY, HTTP_CODE.FAILED)
  }
}

export default UserController;