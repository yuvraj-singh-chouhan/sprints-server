import { Attributes, InferAttributes, QueryOptions } from "sequelize";
import BaseRepository from "../Base/Repository";
import { db } from "../../config/sequelize";

const { Category } = db;

class Repository extends BaseRepository{

  data?: InferAttributes<InstanceType<typeof Category>>;
  query?: any;

  constructor(data?: Attributes<InstanceType<typeof Category>>, query?: QueryOptions){
    super();
    this.data = data;
    this.query = query;
  }


  /**
   * Add category
   * @param datas
   * @returns
   */
  async addCategory(): Promise<InstanceType<typeof Category> | null> {
    const category: InstanceType<typeof Category > | null = await Category.create(this.data!);
    if(category){
      return category;
    }
    return null;
  }

  /**
   * Update category
   * @param data
   * @param query
   * @returns
   */
  async updateCategory(data: InferAttributes<InstanceType<typeof Category>>, query?: any): Promise<number | null> {
    const [rowsUpdated]: any = await Category.update(data, query);
    if(rowsUpdated > 0){
      return rowsUpdated;
    }
    return null;
  }

}

export default Repository;

