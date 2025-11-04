
import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes, Sequelize, Attributes, BelongsToManyAddAssociationsMixin, Association } from "sequelize";
import { Variant } from "../Variant/Model";
import { dbModels } from "../../types/db";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare _id: CreationOptional<string>;
  declare totalProductCount: number;
  declare name: string;
  declare SKU: CreationOptional<string>;
  declare description: string;
  declare price: number;
  declare salePrice: CreationOptional<boolean>;
  declare vendor_id: string;
  declare category_id: string;
  declare isDeleted: CreationOptional<boolean>;
  declare status: CreationOptional<boolean>;
  declare createdBy: CreationOptional<string>;
  declare meta_title: string;
  declare meta_description: string;
  declare meta_keywords: string;
  declare url_slug: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare addVariants: BelongsToManyAddAssociationsMixin<Variant, Variant>;
  declare static associations: {
    variants: Association<Product, Variant>;
  };
}

export class ProductItem extends Model<InferAttributes<ProductItem>, InferCreationAttributes<ProductItem>> {
  declare _id: CreationOptional<string>;
  declare product_id: string;
  declare SKU: string;
  declare price: number;
  declare quantity: number;
  declare category_id: string;
  declare isDeleted: CreationOptional<boolean>;
  declare status: CreationOptional<boolean>;
  declare createdBy: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    SKU: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    salePrice: {
      type: DataTypes.DOUBLE,
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
    url_slug: {
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
    models.Product.belongsToMany(models.Variant, {
      through: models.VariantProduct,
      foreignKey: "product_id",
      as: "variants",
    });
  };
  return { Product, associate };
}















// import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes } from "sequelize";
// import sequelizeConnection from "../../config/sequelize";
// import { User } from "../Users/Model";
// import { Category } from "../Category/Model";
// import { Variant, VariantProduct } from "../Variant/Model";

// class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
//   declare _id: CreationOptional<string>;
//   declare totalProductCount: number;
//   declare name: string;
//   declare SKU: CreationOptional<string>;
//   declare description: string;
//   declare price: number;
//   declare salePrice: CreationOptional<boolean>;
//   declare vendor_id: string;
//   declare category_id: string;
//   declare isDeleted: CreationOptional<boolean>;
//   declare status: CreationOptional<boolean>;
//   declare createdBy: CreationOptional<string>;
//   declare meta_title: string;
//   declare meta_description: string;
//   declare meta_keywords: string;
//   declare url_slug: string;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;

//   public addVariant!: (variant: Variant, options?: any) => Promise<void>;
//   public addVariants!: (variants: Variant[], options?: any) => Promise<void>;
//   public getVariants!: () => Promise<Variant[]>;
// }


// Product.init({
//   _id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     primaryKey: true,
//     defaultValue: DataTypes.UUIDV4
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   SKU: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   price: {
//     type: DataTypes.DECIMAL,
//     allowNull: false
//   },
//   category_id: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   vendor_id: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   salePrice: {
//     type: DataTypes.DOUBLE,
//     allowNull: false
//   },
//   isDeleted: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   },
//   status: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: true
//   },
//   createdBy: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   meta_title: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   meta_description: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   meta_keywords: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   url_slug: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   totalProductCount: {
//     type: DataTypes.BIGINT,
//     allowNull: true
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }
// }, {
//   tableName: 'products',
//   sequelize: sequelizeConnection,
//   timestamps: true,
//   createdAt: 'createdAt',
//   updatedAt: 'updatedAt'
// })


// export const associate = (models: any) => {
//   Product.belongsTo(models.Category, { foreignKey: "category_id" });
//   Product.belongsToMany(models.Variant, {
//     through: models.VariantProduct,
//     foreignKey: "product_id",
//     as: "variants",
//   });
// };


// class ProductItem extends Model<InferAttributes<ProductItem>, InferCreationAttributes<ProductItem>> {
//   declare _id: CreationOptional<string>;
//   declare product_id: string;
//   declare variant_id: string;
//   declare sku: string;
//   declare price: number;
//   declare quantity: number;
//   declare category_id: string;
//   declare isDeleted: CreationOptional<boolean>;
//   declare status: CreationOptional<boolean>;
//   declare createdBy: CreationOptional<string>;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
// }

// ProductItem.init({
//   _id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     primaryKey: true,
//     defaultValue: DataTypes.UUIDV4
//   },
//   product_id: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   variant_id: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   sku: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   price: {
//     type: DataTypes.DECIMAL,
//     allowNull: false
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   isDeleted: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   },
//   category_id: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   status: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: true
//   },
//   createdBy: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }
// }, {
//   tableName: 'product_items',
//   sequelize: sequelizeConnection,
//   timestamps: true,
//   createdAt: 'createdAt',
//   updatedAt: 'updatedAt'
// })


// export { Product };