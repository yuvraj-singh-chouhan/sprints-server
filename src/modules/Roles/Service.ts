import { Request } from "express";
import { db } from "../../config/sequelize";
import { ConflictError, NotFoundError } from "../../Utils/Errors";
import { Attributes, FindOptions, WhereOptions } from "sequelize";
import { RoleRepository } from "./Repository";
import CommonService from "../../services/Global/common";
import { Pagination } from "../Product/types";

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
  async handleCreateRole(): Promise<Attributes<InstanceType<typeof Role>> | null> {
    const { title, permissions }: { title: string, permissions: [] } = this.req.body;

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
  async handleUpdateRole(): Promise<[affectedCount: number]> {
    const roleId = this.req.params.roleId;
    const data: { title: string, permissions: [], status: boolean, isDeleted: boolean } = this.req.body;
    const query: WhereOptions = { _id: roleId, createdBy: this.req.currentUser?._id, isDeleted: false };
    const role: InstanceType<typeof Role> | null = await this.Repository.checkAlreadyExist(Role, query);
    if (!role) {
      throw new ConflictError(i18n.__("DATA_EXIST"));
    }
    const response: [affectedCount: number] = await this.Repository.updateData(Role, data, query);
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
  async handleDeleteRole(data: { roleId: string }): Promise<[affectedCount: number]> {
    const roleId = data.roleId;
    const query: WhereOptions = {
      _id: roleId,
      createdBy: this.req.currentUser?._id,
      isDeleted: false
    }
    const role: InstanceType<typeof Role> | null = await this.Repository.checkAlreadyExist(Role, query);
    if (!role) {
      throw new NotFoundError(i18n.__("NOT_FOUND"));
    }
    const deletedRole: [affectedCount: number] = await this.Repository.updateData(Role, { isDeleted: true }, query);
    return deletedRole;
  }


  async handleRoleListing(data: Pagination) {
    // const data: { page: number, pageSize: number, searchText?: string, filters?: [] } = this.req.body;
    // const page = data.page;
    // const limit = data.pageSize;
    // const skip = (page - 1) * limit;
    // const query: any = { isDeleted: false };
    // const searchText: string | undefined = data.searchText;
    // const andQuery = [];
    // const filters = data.filters;

    // if (searchText) {
    //   andQuery.push({
    //     $or: [{
    //       title: {
    //         like: "%" + searchText + "%"
    //       }
    //     }
    //     ]
    //   })
    // }

    // if (filters && filters.length > 0) {

    // }

    if (this.req.currentUser?.Role?.staticKey !== "super-admin") {
      query['createdBy'] = this.req.currentUser?._id;
      query['updatedBy'] = this.req.currentUser?._id;
    }

    const roles: InstanceType<typeof Role>[] = await Role.findAll({ where: query, limit, offset: skip });
  }

}

export { RolesService };