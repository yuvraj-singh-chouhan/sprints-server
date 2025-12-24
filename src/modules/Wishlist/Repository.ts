import { Attributes, CreationAttributes, WhereOptions } from "sequelize";
import BaseRepository from "../Base/Repository";
import { db } from "../../config/sequelize";

const { Wishlist, WishlistItem } = db;

class WishListRepository extends BaseRepository {

  async createWishList(data: CreationAttributes<InstanceType<typeof Wishlist>>): Promise<Attributes<InstanceType<typeof Wishlist>> | null> {
    const cartData = await this.addData(Wishlist, data)
    return cartData;
  }

  async addItemToWishList(data: CreationAttributes<InstanceType<typeof WishlistItem>>, query: WhereOptions): Promise<[affectedCount: number]> {
    const updatedCartData: [affectedCount: number] = await this.updateData(WishlistItem, data, query );
    return updatedCartData;
  }

  async removeItemFromWishList(): Promise<void>{
    return;
  }
}


export { WishListRepository };