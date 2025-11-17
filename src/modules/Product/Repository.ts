import { isEmpty } from "lodash";
import BaseRepository from "../Base/Repository";
import { db } from "../../config/sequelize";
import { Attributes, FindOptions, WhereOptions } from "sequelize";

const { Product } = db;

export default class PorductRepository extends BaseRepository {

  async handleProductListing(query: FindOptions, paginationOptions: { limit: number, offset: number }): Promise<Attributes<InstanceType<typeof Product>>[] | []> {
    try {
      const Products: Attributes<InstanceType<typeof Product>>[] | [] = await this.getListingData<InstanceType<typeof Product>>(Product, query, null, paginationOptions)
      return Products;
    } catch (error) {
      console.log("Error in handleProductListing", error);
      throw error;
    }
  }

  async updateProduct(data: Attributes<InstanceType<typeof Product>>, query: WhereOptions): Promise<[affectedCount: number]> {
    try {
      const updatedProduct: [affectedCount: number] = await this.updateData<InstanceType<typeof Product>>(Product, data, query);
      return updatedProduct;
    }
    catch (error) {
      console.log("Error in updatedProduct", error);
      throw error;
    }
  }

  async productDetails(query: FindOptions): Promise<Attributes<InstanceType<typeof Product>> | null> {
    try {
      console.log("productDetails query", query);
      const product: Attributes<InstanceType<typeof Product>> | null = await this.getDetails(Product, query);
      return product;
    } catch (error) {
      console.log("Error in ProductDetails", error);
      throw error;
    }
  }

  async findProductCount(): Promise<number> {
    let productCount: Attributes<InstanceType<typeof Product>> | null = await Product.findOne({ order: [["createdAt", "DESC"]] });
    if (isEmpty(productCount)) {
      return 1;
    }
    return +productCount?.totalProductCount + 1;
  }
}