import { NextFunction, Request, Response } from "express";
import BaseController from "../Base/Controller";
import CommonService from "../../services/Global/common";
import { HTTP_CODE } from "../../services/Global/constant";
import { db } from "../../config/sequelize";
import { RolesService } from "./Service";
import { Attributes } from "sequelize";

const { Role } = db;

class RoleController extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
  }

  async createRole() {
    try {
      const processBody = ["title", "permissions"];
      const processedBody = CommonService.processBody(processBody, this.req.body);
      const response = await new RolesService(this.req).handleCreateRole(processedBody);
      CommonService.handleResponse(this.res, "ROLE_CREATED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      console.log("Error in createRole", error);
      this.next(error);
    }
  }

  /**************************************************
   * @params {
   * }
   *
   * @returns
   *************************************************/
  async getRoles() {
    try {
      const query = { isDeleted: false, status: true };
      const roles: InstanceType<typeof Role>[] = await Role.findAll({ where: query });
      return CommonService.handleResponse(this.res, "ROLES_FETCHED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, { roles });
    } catch (error) {
      console.log("Error in getAllRoles", error);
      this.next(error);
    }
  }

  /**************************************************
   * @params {
   *    searchText: "",
   *    page: 1,
   *    pageSize: 25
   * }
   *
   * @returns
   *************************************************/

  async getRoleListing() {
    try {
      const processBody = ["page", "pageSize", "searchText", "filters"];
      const processedBody = CommonService.processBody(processBody, this.req.body);
      const response: Attributes<InstanceType<typeof Role>>[] | [] = await new RolesService(this.req).handleRoleListing(processedBody);
      CommonService.handleResponse(this.res, "ROLES_FETCHED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      console.log("Error in getRoleListing", error);
      this.next(error);
    }
  }

  /**************************************************
   * @params {
   *    title: "",
   *    permissions: []
   * }
   *
   * @returns
   *************************************************/
  async updateRole() {
    try {
      const processBody = ["roleId", "title", "permissions", "status"];
      const processedBody = CommonService.processBody(processBody, this.req.body);
      const response = await new RolesService(this.req).handleUpdateRole(processedBody);
      CommonService.handleResponse(this.res, "ROLE_UPDATED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      console.log("Error in updateRole", error);
      this.next(error);
    }
  }

  /**************************************************
   * @params {
   *    title: "",
   *    permissions: []
   * }
   *
   * @returns
   *************************************************/

  async deleteRole() {
    try {
      const response: [affectedCount: number] = await new RolesService(this.req).handleDeleteRole();
      CommonService.handleResponse(this.res, "ROLE_UPDATED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, response);
    } catch (error) {
      console.log("Error in deleteRole", error);
      this.next(error);
    }
  }

}

export default RoleController;