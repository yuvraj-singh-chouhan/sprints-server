import { isEmpty } from "lodash";
import BaseRepository from "../Base/Repository";
import { db } from "../../config/sequelize";

const { Product } = db;

export default class PorductRepository extends BaseRepository{

  async findProductCount(): Promise<number>{
    let productCount = await Product.findOne({ order: [["createdAt", "DESC"]]});
    if(isEmpty(productCount)){
      return 1;
    }
    return +productCount?.totalProductCount + 1;
  }
}