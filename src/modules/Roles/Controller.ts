import { NextFunction, Request, Response } from "express";
import BaseController from "../Base/Controller";
import CommonService from "../../services/Global/common";
import { HTTP_CODE } from "../../services/Global/constant";
import { db } from "../../config/sequelize";

const { Role } = db;

class RoleController extends BaseController<Request>{
  constructor(req: Request, res: Response, next: NextFunction){
    super(req, res, next);
  }

  async createRole(){
    try {
      const { title, permissions }: {title: string, permissions: []} = this.req.body;

      const  staticKey: string = title.toLowerCase().split(' ').join('-');
      const alreadyExistRole: InstanceType<typeof Role> | null = await Role.findOne({ where: { staticKey, isDeleted: false } });
      if(alreadyExistRole){
        return CommonService.handleResponse(this.res, "ROLE_ALREADY_EXISTS", HTTP_CODE.CONFLICT_CODE, HTTP_CODE.FAILED);
      }
      const role: InstanceType<typeof Role> = await Role.create({ title, staticKey, permissions, createdBy: this.req?.currentUser?._id, updatedBy: this.req?.currentUser?._id });
      return CommonService.handleResponse(this.res, "ROLE_CREATED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, {role});
    } catch (error) {
      console.log("Error in createRole", error);
      this.next(error);
    }
  }

  /**************************************************
   * @params {
   *    }
   *
   * @returns
   *************************************************/
  async getRoles(){
    try {
      const query = { isDeleted: false, status: true };
      const roles: InstanceType<typeof Role>[] = await Role.findAll({ where: query });
      return CommonService.handleResponse(this.res, "ROLES_FETCHED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, {roles});
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

  async getRoleListing(){
    try {
      const data: {page: number, pageSize: number, searchText?: string, filters?: []} = this.req.body;
      const page = data.page;
      const limit = data.pageSize;
      const skip = ( page - 1 ) * limit;
      const query: any = { isDeleted: false};
      const searchText: string | undefined = data.searchText;
      const andQuery = [];
      const filters = data.filters;

      if(searchText){
        andQuery.push({ $or:[{
          title: {
            like: "%" + searchText + "%"
          }}
        ]})
      }

      if(filters && filters.length > 0){

      }

      if(this.req.currentUser?.Role?.staticKey !== "super-admin"){
        query['createdBy'] = this.req.currentUser?._id;
        query['updatedBy'] = this.req.currentUser?._id;
      }

      const roles: InstanceType<typeof Role>[] = await Role.findAll({where: query, limit, offset: skip});
      return CommonService.handleResponse(this.res, "ROLES_FETCHED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS, roles);
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
  async updateRole(){
    try {
      const roleId = this.req.params.roleId;
      const data: {title?: string, permissions?: [], status?: boolean, isDeleted?: boolean} = this.req.body;
      const query = {
        where: { _id: roleId, createdBy: this.req.currentUser?._id },
        isDeleted: false
      }
      const role: InstanceType<typeof Role> | null = await Role.findOne({ where: query });
      if(!role){
        return CommonService.handleResponse(this.res, "ROLE_NOT_FOUND", HTTP_CODE.NOT_FOUND_CODE, HTTP_CODE.FAILED);
      }
      await role.update(data);
      return CommonService.handleResponse(this.res, "ROLE_UPDATED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS);
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

  async deleteRole(){
    try {
      const roleId = this.req.params.roleId;
      const query = {
        where: { _id: roleId, createdBy: this.req.currentUser?._id },
        isDeleted: false
      }
      const role: InstanceType<typeof Role> | null = await Role.findOne({ where: query });
      if(!role){
        return CommonService.handleResponse(this.res, "ROLE_NOT_FOUND", HTTP_CODE.NOT_FOUND_CODE, HTTP_CODE.FAILED);
      }
      await role.update({ isDeleted: true });
      return CommonService.handleResponse(this.res, "ROLE_DELETED", HTTP_CODE.SUCCESS_CODE, HTTP_CODE.SUCCESS);
    } catch (error) {
      console.log("Error in deleteRole", error);
      this.next(error);
    }
  }


}

export default RoleController;