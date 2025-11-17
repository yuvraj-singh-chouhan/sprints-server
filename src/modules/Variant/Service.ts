import { Attributes, InferCreationAttributes, Model, WhereOptions } from "sequelize";
import VariantRepository from "./Repository";
import _ from "lodash"
import { ConflictError } from "../../Utils/Errors";
import i18n from "i18n"
import CommonService from "../../services/Global/common";
import { db } from "../../config/sequelize";

const { VariantTemplate, Variant } = db;

// service class for handling variant operations
class Service {
  Repository: VariantRepository
  constructor() {
    this.Repository = new VariantRepository();
  }

  /**
   * Handle Add Variant Template details
   * @param data
   * @returns
   */

  async handleAddVariantTemplate(data: Attributes<InstanceType<typeof VariantTemplate>>) {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(data.title);
    const query: WhereOptions = {
      staticKey,
      isDeleted: false,
    }
    const checkAlreadyExist: Model<typeof VariantTemplate> | null = await this.Repository.checkAlreadyExist(VariantTemplate, query)
    if (!_.isEmpty(checkAlreadyExist)) {
      throw new ConflictError(i18n.__("DATA_EXIST"));
    }
    const variantTemplate: Attributes<InstanceType<typeof VariantTemplate>> | null = await new VariantRepository(query).addVariantTemplate(data);
    if (!_.isEmpty(variantTemplate)) {
      return variantTemplate;
    }
    throw new Error(i18n.__("FAILED_TO_CREATE_DATA"));
  }

  /**
   * Handle Get Variant details
   */

  async handleVariantTemplateListing(data: any): Promise<Attributes<InstanceType<typeof VariantTemplate>>[] | []> {
    const [query, limit, offset] = CommonService.generateListingQuery(data, ["title"]);
    const variantTemplates: Attributes<InstanceType<typeof VariantTemplate>>[] | [] = await new VariantRepository(query).handleVariantTemplateListing(query, { limit, offset });
    return variantTemplates;
  }


  /**
   * Handle Add Variant from admin side
   * @returns 
   */
  async handleAddVariant(data: Attributes<InstanceType<typeof Variant>>): Promise<Attributes<InstanceType<typeof Variant>>> {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(data.title);
    const query: WhereOptions = {
      staticKey,
      isDeleted: false,
    }
    const checkAlreadyExist: Model<InstanceType<typeof Variant>> | null = await this.Repository.checkAlreadyExist(Variant, query)
    if (!_.isEmpty(checkAlreadyExist)) {
      throw new ConflictError(i18n.__("DATA_EXIST"));
    }
    const results: Attributes<InstanceType<typeof Variant>> | null = await new VariantRepository(query).addVariant(data);
    if (!_.isEmpty(results)) {
      return results;
    }
    throw new Error(i18n.__("FAILED_TO_CREATE_DATA"));
  }

  /**
   * Handle Add Variant from admin side
   * @returns 
   */
  async handleUpdateVariantTemplate(data: Attributes<InstanceType<typeof VariantTemplate>>): Promise<[affectedCount: number]> {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(data.title);
    const query: WhereOptions = {
      staticKey,
      isDeleted: false,
      id: data._id
    }
    const checkAlreadyExist: Model<typeof VariantTemplate> | null = await this.Repository.checkAlreadyExist(VariantTemplate, query)
    if (!_.isEmpty(checkAlreadyExist)) {
      const results: [affectedCount: number] = await new VariantRepository(query).updateVariantTemplate(data, query);
      if (!_.isEmpty(results)) {
        return results;
      }
    }
    throw new Error(i18n.__("FAILED_TO_CREATE_DATA"));
  }

  /**
   * Handle variant listing from admin side
   */

  async handleVariantListing(data: any): Promise<Attributes<InstanceType<typeof Variant>>[] | []> {
    const [query, limit, offset] = CommonService.generateListingQuery(data, ["title"]);
    const variants: Attributes<InstanceType<typeof Variant>>[] | [] = await new VariantRepository(query).handleVariantListing(query, { limit, offset });
    return variants;
  }
}

export default Service;