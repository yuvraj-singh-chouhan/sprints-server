import { Attributes, CreationAttributes, WhereOptions } from "sequelize";
import BaseRepository from "../Base/Repository";
import { db } from "../../config/sequelize";

const { Product, Cart, CartItem } = db;
class CartRepository extends BaseRepository {

  async createCart(data: CreationAttributes<InstanceType<typeof Cart>>): Promise<Attributes<InstanceType<typeof Cart>> | null> {
    const cartData = await this.addData(Cart, data)
    return cartData;
  }

  async updateCart(data: CreationAttributes<InstanceType<typeof CartItem>>, query: WhereOptions): Promise<[affectedCount: number]> {
    const updatedCartData: [affectedCount: number] = await this.updateData(CartItem, data, query );
    return updatedCartData;
  }
}

export { CartRepository };