<<<<<<< Updated upstream
import { FindOptions, InferAttributes, InferCreationAttributes, Model } from "sequelize";
=======
import { Attributes, FindOptions, InferAttributes, InferCreationAttributes, Model, WhereOptions } from "sequelize";
>>>>>>> Stashed changes
import VariantRepository from "./Repository";
import { VariantTemplate } from "./Model";
import _ from "lodash"
import { ConflictError } from "../../Utils/Errors";
import i18n from "i18n"
import CommonService from "../../services/Global/common";

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

  async handleAddVariantTemplate(data: InferCreationAttributes<VariantTemplate>) {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(data.title);
    const query: WhereOptions = {
      staticKey,
      isDeleted: false,
    }
    const checkAlreadyExist: Model<VariantTemplate> | null = await this.Repository.checkAlreadyExist(VariantTemplate, query)
    if (!_.isEmpty(checkAlreadyExist)) {
      throw new ConflictError(i18n.__("DATA_EXIST"));
    }
<<<<<<< Updated upstream
    const variantTemplate: Model<VariantTemplate> | null = await new VariantRepository(query).addVariantTemplate(data);
    if(!_.isEmpty(variantTemplate)){
=======
    const variantTemplate: Attributes<VariantTemplate> | null = await new VariantRepository(query).addVariantTemplate(data);
    if (!_.isEmpty(variantTemplate)) {
>>>>>>> Stashed changes
      return variantTemplate;
    }
    throw new Error(i18n.__("FAILED_TO_CREATE_DATA"));
  }

  /**
   * Handle Get Variant details
   */

  async handleVariantTemplateListing(data: Pagination): Promise<Attributes<VariantTemplate>[] | []> {
    const [query, limit, offset] = CommonService.generateListingQuery<Attributes<VariantTemplate>>(data, ["title"]);
    const variantTemplates: Attributes<VariantTemplate>[] | [] = await new VariantRepository(query).handleVariantTemplateListing(query, { limit, offset });
    return variantTemplates;
  }
<<<<<<< Updated upstream
=======


  /**
   * Handle Add Variant from admin side
   * @returns 
   */
  async handleAddVariant(data: Attributes<Variant>): Promise<Attributes<Variant>> {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(data.title);
    const query: WhereOptions = {
      staticKey,
      isDeleted: false,
    }
    const checkAlreadyExist: Model<Variant> | null = await this.Repository.checkAlreadyExist(Variant, query)
    if (!_.isEmpty(checkAlreadyExist)) {
      throw new ConflictError(i18n.__("DATA_EXIST"));
    }
    const results: Attributes<Variant> | null = await new VariantRepository(query).addVariant(data);
    if (!_.isEmpty(results)) {
      return results;
    }
    throw new Error(i18n.__("FAILED_TO_CREATE_DATA"));
  }

  /**
   * Handle Add Variant from admin side
   * @returns 
   */
  async handleUpdateVariantTemplate(data: Attributes<VariantTemplate>): Promise<Attributes<VariantTemplate>> {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(data.title);
    const query: WhereOptions = {
      staticKey,
      isDeleted: false,
      id: data._id
    }
    const checkAlreadyExist: Model<VariantTemplate> | null = await this.Repository.checkAlreadyExist(VariantTemplate, query)
    if (!_.isEmpty(checkAlreadyExist)) {
      const results: Attributes<VariantTemplate> | null = await new VariantRepository(query).updateVariantTemplate(data, query);
      if (!_.isEmpty(results)) {
        return results;
      }
    }
    throw new Error(i18n.__("FAILED_TO_CREATE_DATA"));
  }

  /**
   * Handle variant listing from admin side
   */

  async handleVariantListing(data: Pagination): Promise<Attributes<Variant>[] | []> {
    const [query, limit, offset] = CommonService.generateListingQuery<Attributes<Variant>>(data, ["title"]);
    const variants: Attributes<Variant>[] | [] = await new VariantRepository(query).handleVariantListing(query, { limit, offset });
    return variants;
  }
>>>>>>> Stashed changes
}

export default Service;