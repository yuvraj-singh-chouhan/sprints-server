import type { Sequelize } from "sequelize"
import type { Product, ProductItem } from "../modules/Product/Model"
import type { Variant, VariantTemplate } from "../modules/Variant/Model"
import type { Permission, Role } from "../modules/Roles/Model"
import type { User } from "../modules/Users/Model"
import type { AuthenticationToken } from "../modules/Authentication/Model"
import type { Category } from "../modules/Category/Model"
import { Wishlist, WishlistItem } from "../modules/Wishlist/Model"

interface dbModels {
  Product: Model<Product>
  Variant: Model<Variant>,
  VariantTemplate: Model<VariantTemplate>,
  Role: Model<Role>,
  Permission: Model<Permission>,
  User: Model<User>,
  ProductItem: Model<ProductItem>,
  AuthenticationToken: Model<AuthenticationToken>,
  Category: Model<Category>,
  VariantProduct: ModelStatic<VariantProduct>
  WishList: ModelStatic<Wishlist>
  WishListItem: ModelStatic<WishlistItem>
}

export interface Database {
  sequelize: Sequelize,
  models: Partial<dbModels>
}