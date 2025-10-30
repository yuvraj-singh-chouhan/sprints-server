import BaseRepository from "../Base/Repository";
<<<<<<< Updated upstream
import { FindOptions, InferAttributes, InferCreationAttributes, Model, QueryTypes } from "sequelize";
=======
import { Attributes, FindOptions, InferAttributes, InferCreationAttributes, Model, QueryTypes, WhereOptions } from "sequelize";
>>>>>>> Stashed changes
import { Variant, VariantTemplate } from "./Model";
import { MakeNullishOptional } from "sequelize/types/utils";

class VariantRepository extends BaseRepository {
  query?: FindOptions;

  constructor(query?: FindOptions) {
    super()
    this.query = query;
  }

  async addVariantTemplate(data: MakeNullishOptional<InferCreationAttributes<VariantTemplate, {
    omit: never;
<<<<<<< Updated upstream
}>>): Promise<Model<VariantTemplate> | null>{
=======
  }>>): Promise<Attributes<VariantTemplate> | null> {
>>>>>>> Stashed changes
    try {
      const variantTemplateData: Model<VariantTemplate> | null = await this.addData<VariantTemplate>(VariantTemplate, data);
      return variantTemplateData;
    } catch (error) {
      console.log("Error in add Vairant data", error);
      throw error;
    }
  }
<<<<<<< Updated upstream
=======


  async updateVariantTemplate(data: Attributes<VariantTemplate>, query: WhereOptions): Promise<Attributes<VariantTemplate> | null>{
    try{
      const updatedVariantTemplate: Attributes<VariantTemplate> | null = await this.updateData<VariantTemplate>(VariantTemplate, data, query);
      return updatedVariantTemplate;
    }
    catch(error){
      console.log("Error in updateVariantTemplate", error);
      throw error;
    }
  }

  async handleVariantTemplateListing(query: FindOptions, paginationOptions: { limit: number, offset: number }): Promise<Attributes<VariantTemplate>[] | []> {
    try {
      const variantTemplates: Attributes<VariantTemplate>[] | [] = await this.getListingData<VariantTemplate>(VariantTemplate, query, null, paginationOptions)
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
  async addVariant(data: Attributes<Variant>): Promise<Attributes<Variant> | null> {
    try {
      const variantData: Attributes<Variant> | null = await this.addData<Variant>(Variant, data);
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

  async handleVariantListing(query: FindOptions, paginationOptions: { limit: number, offset: number }): Promise<Attributes<Variant>[] | []> {
    try {
      const variants: Attributes<Variant>[] | [] = await this.getListingData<Variant>(Variant, query, null, paginationOptions)
      return variants;
    } catch (error) {
      console.log("Error in handleVariantListing", error);
      throw error;
    }
  }
>>>>>>> Stashed changes
}

export default VariantRepository;
