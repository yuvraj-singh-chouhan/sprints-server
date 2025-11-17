import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { User } from "../Users/Model";
import { Product } from "../Product/Model";


export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare _id: CreationOptional<string>;
  declare userId: ForeignKey<User['_id']>;
}

export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
  declare _id: CreationOptional<string>;
  declare quantity: number;
  declare productId: ForeignKey<Product['_id']>;;
  declare cartId: ForeignKey<Cart['_id']>;;
}

export default (sequelizeConnection: Sequelize) => {
  Cart.init({
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
    tableName: "cart",
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  })

  CartItem.init({
    _id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    quantity:{
      type: DataTypes.INTEGER,
      allowNull: false
    },  
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'cartitems',
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: true
  })

  const associate = (models: any) => {}

  return { Cart, CartItem, associate }
}