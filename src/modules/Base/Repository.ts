import { isEmpty } from "lodash";
import { FindOptions, Model, ModelStatic, WhereOptions, Attributes } from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";

class BaseRepository{
  /**
   * Chexk already exist  category
   * @returns
   */
  async checkAlreadyExist<T extends Model>(Model: ModelStatic<T>, query: WhereOptions<T>): Promise<T | null > {
    try {
      const existedItem = await Model.findOne({  where: query });
      if(existedItem){
        return existedItem;
      }
      return null;
    } catch (error) {
      console.log("Error in checkAlreadyExist", error);
      throw error;
    }
  }

  async addData<T extends Model>(Model: ModelStatic<T>, data: MakeNullishOptional<T["_creationAttributes"]>): Promise<null | T>{
    try {
      const newData: T = await Model.create(data)
      if(newData){
        return newData;
      }
      return null;
    } catch (error) {
      console.log("Error in add Data", error);
      throw error;
    }
  }

  async updateData<T extends Model>(Model: ModelStatic<T>, data: Attributes<T["_creationAttributes"]>, query: WhereOptions): Promise<[affectedCount: number]>{
    try {
      const updatedData: [affectedCount: number] = await Model.update(data, { where: query})
      return updatedData
    } catch (error) {
      console.log("Error in updateData", error);
      throw error
    }
  }


  async getListingData<T extends Model>(Model: ModelStatic<T>, query: FindOptions<T> , projection?: any, paginationOptions?: { limit?: number, offset?: number }): Promise<T[]> {
    try {
      const queryObj = {
        ...(isEmpty(query.where) ? {} : query),
        ...(isEmpty(paginationOptions) ? {} : paginationOptions)
      }

      const data = await Model.findAll(queryObj);
      return data;
    } catch (error) {
      console.log("Error in getListingData", error);
      throw error;
    }
  }


  async getDetails<T extends Model>(Model: ModelStatic<T>, query: FindOptions<T>, projection?: any){
    try{
      const data = await Model.findOne(query);
      return data;
    }catch(error){
      console.log("Error in getDetais", error);
      throw error;
    }
  }

  async deleteData<T extends Model>(Model: ModelStatic<T>, query?: FindOptions<T>): Promise<number | null>{
    try {
      const deletedItem = await Model.destroy(query);
      if(deletedItem){
        return deletedItem;
      }
      return null;
    } catch (error) {
      console.log("Error in deleteData", error);
      throw error;
    }
  }

}

export default BaseRepository;
