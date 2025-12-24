import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { User } from "../Users/Model";
import { Product } from "../Product/Model";


export class Wishlist extends Model<InferAttributes<Wishlist>, InferCreationAttributes<Wishlist>> {
  declare _id: CreationOptional<string>;
  declare userId: ForeignKey<User['_id']>;
}

export class WishlistItem extends Model<InferAttributes<WishlistItem>, InferCreationAttributes<WishlistItem>> {
  declare _id: CreationOptional<string>;
  declare productId: ForeignKey<Product['_id']>;;
  declare wishlistId: ForeignKey<Wishlist['_id']>;;
}

export default (sequelizeConnection: Sequelize) => {
  Wishlist.init({
    _id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: "wishlist",
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  })

  WishlistItem.init({
    _id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },  
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    wishlistId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'wishlistitems',
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: true
  })

  const associate = (models: any) => {
    Wishlist.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Wishlist.hasMany(models.WishlistItem, { foreignKey: 'wishlistId', as: 'wishlistItems' });
    WishlistItem.belongsTo(models.Wishlist, { foreignKey: 'wishlistId', as: 'wishlist' });
    WishlistItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }

  return { Wishlist, WishlistItem, associate }
}