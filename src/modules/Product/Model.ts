
import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes, Sequelize, Attributes, BelongsToManyAddAssociationsMixin, Association } from "sequelize";
import { Variant } from "../Variant/Model";
import { dbModels } from "../../types/db";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare _id: CreationOptional<string>;
  declare totalProductCount: number;
  declare name: string;
  declare description: string;
  declare category_id: string;
  declare isDeleted: CreationOptional<boolean>;
  declare status: CreationOptional<boolean>;
  declare createdBy: CreationOptional<string>;
  declare meta_title: string;
  declare meta_description: string;
  declare meta_keywords: string;
  declare slug: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    variants: Association<Product, Variant>;
  };
}

export class ProductItem extends Model<InferAttributes<ProductItem>, InferCreationAttributes<ProductItem>> {
  declare _id: CreationOptional<string>;
  declare product_id: string;
  declare SKU: string
  declare price: number;
  declare salePrice: number;
  declare quantity: number;
  declare category_id: string;
  declare vendor_id: string;
  declare slug: string
  declare isDeleted: CreationOptional<boolean>;
  declare status: CreationOptional<boolean>;
  declare createdBy: string;
  declare meta_title: string;
  declare meta_description: string;
  declare meta_keywords: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;


  declare addVariants: BelongsToManyAddAssociationsMixin<Variant, Variant>;
  declare getVariants: BelongsToManyAddAssociationsMixin<Variant, Variant>;

}

export default (sequelizeConnection: Sequelize) => {

  Product.init({
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false
    },
    meta_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    meta_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    meta_keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalProductCount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'products',
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  })

  ProductItem.init({
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salePrice:{
      type: DataTypes.DECIMAL,
    },
    SKU: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    vendor_id: {
      type: DataTypes.UUID  ,
      allowNull: false
    },
    meta_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    meta_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    meta_keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'product_items',
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  })


  const associate = (models: dbModels) => {
    models.Product.belongsTo(models.Category, { foreignKey: "category_id" });
    models.Product.hasMany(models.ProductItem);
    models.ProductItem.belongsTo(models.User, { foreignKey: "vendor_id", as: "vendor" });
    models.ProductItem.belongsTo(models.Product, {foreignKey: "product_id"});
    models.ProductItem.belongsToMany(models.Variant, {
      through: models.VariantProduct,
      foreignKey: "product_id",
      as: "variants",
    });
  };

  return { Product, ProductItem, associate };
}
