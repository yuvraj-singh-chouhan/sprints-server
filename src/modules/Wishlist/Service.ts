import _ from "lodash";
import { Attributes, CreationAttributes, FindOptions, WhereOptions } from "sequelize";
import { db } from "../../config/sequelize";
import { Request } from "express";
import { WishListRepository } from "./Repository";

const { WishlistItem, Wishlist } = db;

class WishListService {
  req: Request;

  constructor(req: Request) {
    this.req = req
  }

  async handleWishList(productDetails: { productId: string, SKU: string }): Promise<Attributes<InstanceType<typeof WishlistItem>> | [affectedCount: number] | null> {
    const Repository: InstanceType<typeof WishListRepository> = new WishListRepository();
    const { productId, SKU } = productDetails;
    const currentUser = this.req.currentUser;
    const wishlistDetails = {
      userId: currentUser._id,
    }

    let wishlist: Attributes<InstanceType<typeof Wishlist>> | null;

    let checkAlreadyExist = await Repository.checkAlreadyExist(Wishlist, wishlistDetails);

    if(_.isEmpty(checkAlreadyExist)){
      wishlist = await Repository.createWishList(wishlistDetails);
    } else {
      wishlist = checkAlreadyExist;
    }

    const wishListItems: CreationAttributes<InstanceType<typeof WishlistItem>> = {
      wishlistId: wishlist?._id,
      productId
    }
    let wishlistitem: Attributes<InstanceType<typeof WishlistItem>> | [affectedCount: number] | null;
    wishlistitem = await Repository.addData(WishlistItem, wishListItems);

    return wishlistitem;
  }

  async removeItemFromWishList(wishlistdetails: Attributes<InstanceType<typeof WishlistItem>>): Promise<number | null> {
    const Repository: InstanceType<typeof WishListRepository> = new WishListRepository();

    const query: FindOptions = {
      where: {
        ...wishlistdetails
      }
    }
    const removedItem: number | null = await Repository.deleteData(WishlistItem, query);
    return removedItem;
  }

  async handleWishListDetails(): Promise<Attributes<InstanceType<typeof WishlistItem>> []| []> {
    const currUserId = this.req.currentUser._id;
    const Repository = new WishListRepository();
    if (_.isEmpty(currUserId)) {
      return [];
    }

    const wishListQuery: FindOptions = {
      where: {
        userId: currUserId
      }
    }

    const wishlist: Attributes<InstanceType<typeof Wishlist>> | null = await Repository.getDetails(Wishlist, wishListQuery);

    if(_.isEmpty(wishlist)) return [];
    const wishListItemQuery: FindOptions = {
      where:{
        wishlistId: wishlist._id,
      }
    }
    const wishListItems: Attributes<InstanceType<typeof WishlistItem>>[] | [] = await Repository.getListingData(WishlistItem, wishListItemQuery);
    return wishListItems;
  }
}

export { WishListService };