import BaseRepository from "../Base/Repository";
import { Attributes, FindOptions, InferAttributes, InferCreationAttributes, Model, QueryTypes, WhereOptions } from "sequelize";
// import { Variant, VariantTemplate } from "./Model";
import { MakeNullishOptional } from "sequelize/types/utils";
import { db } from "../../config/sequelize";

const { VariantTemplate, Variant } = db;

class VariantRepository extends BaseRepository {
  query?: FindOptions;

  constructor(query?: FindOptions) {
    super()
    this.query = query;
  }

  async addVariantTemplate(data: MakeNullishOptional<InferCreationAttributes<typeof VariantTemplate, {
    omit: never;
  }>>): Promise<Attributes<typeof VariantTemplate> | null> {
    try {
      const variantTemplateData: Model<typeof VariantTemplate> | null = await this.addData<typeof VariantTemplate>(VariantTemplate, data);
      return variantTemplateData;
    } catch (error) {
      console.log("Error in add Vairant data", error);
      throw error;
    }
  }


  async updateVariantTemplate(data: Attributes<typeof VariantTemplate>, query: WhereOptions): Promise<Attributes<typeof VariantTemplate> | null> {
    try {
      const updatedVariantTemplate: Attributes<typeof VariantTemplate> | null = await this.updateData<typeof VariantTemplate>(VariantTemplate, data, query);
      return updatedVariantTemplate;
    }
    catch (error) {
      console.log("Error in updateVariantTemplate", error);
      throw error;
    }
  }

  async handleVariantTemplateListing(query: FindOptions, paginationOptions: { limit: number, offset: number }): Promise<Attributes<typeof VariantTemplate>[] | []> {
    try {
      const variantTemplates: Attributes<typeof VariantTemplate>[] | [] = await this.getListingData<typeof VariantTemplate>(VariantTemplate, query, null, paginationOptions)
      return variantTemplates;
    } catch (error) {
      console.log("Error in handleVariantTemplateListing", error);
      throw error;
    }
  }

  /**
   * This function is used to add Variants type of variants
   * based on the variant template 
   * @param data 
   * @returns 
   */
  async addVariant(data: Attributes<typeof Variant>): Promise<Attributes<typeof Variant> | null> {
    try {
      const variantData: Attributes<typeof Variant> | null = await this.addData<typeof Variant>(Variant, data);
      return variantData;
    } catch (error) {
      console.log("Error in add variant data", error);
      throw error;
    }
  }

  /**
   * Function to list all the variants for the admin 
   * 
   */

  async handleVariantListing(query: FindOptions, paginationOptions: { limit: number, offset: number }): Promise<Attributes<typeof Variant>[] | []> {
    try {
      const variants: Attributes<typeof Variant>[] | [] = await this.getListingData<typeof Variant>(Variant, query, null, paginationOptions)
      return variants;
    } catch (error) {
      console.log("Error in handleVariantListing", error);
      throw error;
    }
  }
}

export default VariantRepository;
