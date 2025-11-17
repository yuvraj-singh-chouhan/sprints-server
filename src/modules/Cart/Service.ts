import _ from "lodash";
import { Attributes, CreationAttributes, FindOptions, WhereOptions } from "sequelize";
import { db } from "../../config/sequelize";
import { Request } from "express";
import { CartRepository } from "./Repository";

const { Product, Cart, CartItem } = db;

class CartService {
  req: Request;

  constructor(req: Request) {
    this.req = req
  }

  async handleCart(productDetails: { productId: string, SKU: string }): Promise<Attributes<InstanceType<typeof CartItem>> | [affectedCount: number] | null> {
    const Repository: InstanceType<typeof CartRepository> = new CartRepository();
    const { productId, SKU } = productDetails;
    const currentUser = this.req.currentUser;
    const cartDetails = {
      userId: currentUser._id,
    }

    let cart: Attributes<InstanceType<typeof Cart>> | null;

    let checkAlreadyExist = await Repository.checkAlreadyExist(Cart, cartDetails);

    if(_.isEmpty(checkAlreadyExist)){
      cart = await Repository.createCart(cartDetails);
    } else {
      cart = checkAlreadyExist;
    }

    const cartQuery: WhereOptions = {
      productId
    }

    const cartProduct = await Repository.checkAlreadyExist(CartItem, cartQuery);
    const cartItems: CreationAttributes<InstanceType<typeof CartItem>> = {
      quantity: 1,
      cartId: cart?._id,
      productId
    }
    let cartItem: Attributes<InstanceType<typeof CartItem>> | [affectedCount: number] | null;
    if (!_.isEmpty(cartProduct)) {
      cartItems.quantity += +cartItems.quantity
      const query: WhereOptions = {
        productId,
        _id: cartProduct._id
      }
      cartItem = await Repository.updateCart(cartItems, query)
    } else {
      cartItem = await Repository.addData(CartItem, cartItems);
    }

    return cartItem;
  }

  async handleCartDetails(): Promise<Attributes<InstanceType<typeof CartItem>> []| []> {
    const currUserId = this.req.currentUser._id;
    const Repository = new CartRepository();
    if (_.isEmpty(currUserId)) {
      return [];
    }

    const cartQuery: FindOptions = {
      where: {
        userId: currUserId
      }
    }
    console.log({cartQuery})

    const cart: Attributes<InstanceType<typeof Cart>> | null = await Repository.getDetails(Cart, cartQuery);

    console.log("cartdtails", cart);
    if(_.isEmpty(cart)) return [];
    const cartItemQuery: FindOptions = {
      where:{
        cartId: cart._id,
      }
    }
    const cartItem: Attributes<InstanceType<typeof CartItem>>[] | [] = await Repository.getListingData(CartItem, cartItemQuery);
    return cartItem;
  }
}

export { CartService };