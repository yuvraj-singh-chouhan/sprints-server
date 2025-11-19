import { Request } from "express";
import { db } from "../../config/sequelize";
import { ConflictError, NotFoundError } from "../../Utils/Errors";
import { Attributes, FindOptions, Op, WhereOptions } from "sequelize";
import { RoleRepository } from "./Repository";
import CommonService from "../../services/Global/common";
import { Pagination } from "../Product/types";
import i18n from "i18n";
import _ from "lodash"
import { string } from "joi";

const { Role } = db;
class RolesService {
  req: Request;
  Repository: RoleRepository
  constructor(req: Request) {
    this.req = req;
    this.Repository = new RoleRepository();
  }


  /**
   * Service to create Roles
   * @returns {
   *   title: "super admin",
   *   permissions: [],
   * }
   */
  async handleCreateRole(data: Attributes<InstanceType<typeof Role>>): Promise<Attributes<InstanceType<typeof Role>> | null> {
    const { title, permissions }: Attributes<InstanceType<typeof Role>> = data;

    const [slug, staticKey] = CommonService.generateKeyAndSlug(title);
    const query = { staticKey, isDeleted: false };
    const alreadyExistRole: InstanceType<typeof Role> | null = await this.Repository.checkAlreadyExist(Role, query);
    if (alreadyExistRole) {
      throw new ConflictError(i18n.__("DATA_EXIST"))
    }

    const roleData = {
      title,
      staticKey,
      permissions,
      createdBy: this.req.currentUser._id,
      updatedBy: this.req.currentUser._id
    }
    const newRole: Attributes<InstanceType<typeof Role>> | null = await this.Repository.addData(Role, roleData)
    return newRole;
  }

  /**
   * service function to update roles details | Role title
   * @returns {
   *    affectedCount: 0 | 1
   * }
   */
  async handleUpdateRole(roleData: Attributes<InstanceType<typeof Role>>): Promise<[affectedCount: number]> {
    const roleId = this.req.params.roleId;
    let data: Attributes<InstanceType<typeof Role>> = roleData;
    const [slug, staticKey] = CommonService.generateKeyAndSlug(roleData.title);
    const isRoleExist: InstanceType<typeof Role> | null = await this.Repository.checkAlreadyExist(Role, { _id: roleId });
    if (_.isEmpty(isRoleExist)) {
      throw new NotFoundError(i18n.__("NOT_FOUND"));
    }
    const query: WhereOptions = { _id: { [Op.ne]: roleId }, staticKey: staticKey, isDeleted: false };
    const role: InstanceType<typeof Role> | null = await this.Repository.checkAlreadyExist(Role, query);
    console.log("role", role);
    if (!_.isEmpty(role)) {
      throw new ConflictError(i18n.__("DATA_EXIST"));
    }
    const updateRoleData = {
      ...data,
      staticKey,
      updateBy: this.req.currentUser._id,
      permissions: []
    }

    const response: [affectedCount: number] = await this.Repository.updateData(Role, updateRoleData, { _id: roleId });
    return response;
  }

  /**
   * Service to hadle and soft delete Role
   * @argument {
   *    roleId: ""
   * }
   * @returns {
   *    affectedCount: 0 | 1
   * }
   */
  async handleDeleteRole(): Promise<[affectedCount: number]> {
    const roleId = this.req.params.roleId;
    const query: WhereOptions = {
      _id: roleId,
      createdBy: this.req.currentUser?._id,
      isDeleted: false
    }
    const role: InstanceType<typeof Role> | null = await this.Repository.checkAlreadyExist(Role, query);
    if (_.isEmpty(role)) {
      throw new NotFoundError(i18n.__("NOT_FOUND"));
    }
    const deletedRole: [affectedCount: number] = await this.Repository.updateData(Role, { isDeleted: true }, query);
    return deletedRole;
  }


  async handleRoleListing(data: Pagination): Promise<Attributes<InstanceType<typeof Role>>[] | []> {
    let [query, limit, offset]: [FindOptions, number, number] = CommonService.generateListingQuery(data, ['title']);
    if (this.req.currentUser?.Role?.staticKey !== "super-admin") {
      let currentUser = this.req.currentUser._id;
      query = { ...query, where: { ...query.where, createdBy: currentUser, updatedBy: currentUser } }
    }

    const roles: InstanceType<typeof Role>[] = await this.Repository.getListingData(Role, query, {}, { limit, offset: offset });
    return roles;
  }

}

export { RolesService };