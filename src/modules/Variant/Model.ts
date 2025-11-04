import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes, Sequelize } from "sequelize";
// import sequelizeConnection from "../../config/sequelize";
import CommonService from "../../services/Global/common";

/*************************************
 * VariantTemplate
 *************************************/
export class VariantTemplate extends Model<InferAttributes<VariantTemplate>, InferCreationAttributes<VariantTemplate>> {
  declare _id: CreationOptional<string>;
  declare title: string;
  declare staticKey: string;
  declare category_id: CreationOptional<Array<string | []>>;
  declare isDeleted: CreationOptional<boolean>;
  declare status: CreationOptional<boolean>;
}



/*************************************
 * Variant
 *************************************/
export class Variant extends Model<InferAttributes<Variant>, InferCreationAttributes<Variant>> {
  declare _id: CreationOptional<string>;
  declare title: string;
  declare slug: string;
  declare staticKey: string;
  declare variant_template_id: string;
  declare isDeleted: CreationOptional<boolean>;
  declare status: CreationOptional<boolean>;
}

/*************************************
 * VariantProduct
 *************************************/
export class VariantProduct extends Model<InferAttributes<VariantProduct>, InferCreationAttributes<VariantProduct>> {
  declare _id: CreationOptional<string>;
  declare variant_id: string;
  declare product_id: string;
}


export default (sequelizeConnection: Sequelize) => {

  VariantTemplate.init({
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    staticKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: true
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
  }, {
    tableName: 'variant_templates',
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });


  Variant.init({
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    staticKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    variant_template_id: {
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
  }, {
    tableName: 'variants',
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });


  Variant.addHook("beforeValidate", (attribute: Variant) => {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(attribute.title);
    attribute.staticKey = staticKey;
    attribute.slug = slug;
  })

  VariantTemplate.addHook("beforeValidate", (attributes: VariantTemplate) => {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(attributes.title);
    attributes.staticKey = staticKey;
  });


  VariantProduct.init({
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    variant_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
  }, {
    tableName: 'variant_product',
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  const associate = (models: any) => {
    /*************************************
   * VariantValue associations
   *************************************/
    models.VariantTemplate.belongsTo(models.Category, { foreignKey: 'category_id', targetKey: '_id' });
    models.VariantTemplate.hasMany(models.Variant, { foreignKey: 'variant_template_id', sourceKey: '_id' });
  
  
    /*************************************
   * Variant associations
   *************************************/
    models.Variant.belongsTo(models.VariantTemplate, { foreignKey: 'variant_template_id', targetKey: '_id' });
    models.Variant.belongsToMany(models.Product, {
      through: models.VariantProduct,
      foreignKey: "variant_id",
      as: "products",
    });
  };
  return { Variant, VariantTemplate, VariantProduct, associate };
}





























// import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes } from "sequelize";
// import sequelizeConnection from "../../config/sequelize";
// import CommonService from "../../services/Global/common";

// /*************************************
//  * VariantTemplate
//  *************************************/
// class VariantTemplate extends Model<InferAttributes<VariantTemplate>, InferCreationAttributes<VariantTemplate>> {
//   declare _id: CreationOptional<string>;
//   declare title: string;
//   declare staticKey: string;
//   declare category_id: CreationOptional<Array<string | []>>;
//   declare isDeleted: CreationOptional<boolean>;
//   declare status: CreationOptional<boolean>;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
// }

// VariantTemplate.init({
//   _id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     primaryKey: true,
//     defaultValue: DataTypes.UUIDV4
//   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   staticKey: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   category_id: {
//     type: DataTypes.UUID,
//     allowNull: true
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
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }
// }, {
//   tableName: 'variant_templates',
//   sequelize: sequelizeConnection,
//   timestamps: true,
//   createdAt: 'createdAt',
//   updatedAt: 'updatedAt'
// });

// /*************************************
//  * Variant
//  *************************************/
// class Variant extends Model<InferAttributes<Variant>, InferCreationAttributes<Variant>> {
//   declare _id: CreationOptional<string>;
//   declare title: string;
//   declare slug: string;
//   declare staticKey: string;
//   declare variant_template_id: string;
//   declare isDeleted: CreationOptional<boolean>;
//   declare status: CreationOptional<boolean>;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
// }

// Variant.init({
//   _id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     primaryKey: true,
//     defaultValue: DataTypes.UUIDV4
//   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   staticKey: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   slug: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   variant_template_id: {
//     type: DataTypes.UUID,
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
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }
// }, {
//   tableName: 'variants',
//   sequelize: sequelizeConnection,
//   timestamps: true,
//   createdAt: 'createdAt',
//   updatedAt: 'updatedAt'
// });


// Variant.addHook("beforeValidate", (attribute: Variant) => {
//   const [slug, staticKey] = CommonService.generateKeyAndSlug(attribute.title);
//   attribute.staticKey = staticKey;
//   attribute.slug = slug;
// })

// VariantTemplate.addHook("beforeValidate", (attributes: VariantTemplate) => {
//   const [slug, staticKey] = CommonService.generateKeyAndSlug(attributes.title);
//   attributes.staticKey = staticKey;
// });

// /*************************************
//  * VariantProduct
//  *************************************/
// class VariantProduct extends Model<InferAttributes<VariantProduct>, InferCreationAttributes<VariantProduct>> {
//   declare _id: CreationOptional<string>;
//   declare variant_id: string;
//   declare product_id: string;
//   declare isDeleted: CreationOptional<boolean>;
//   declare status: CreationOptional<boolean>;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
// }

// VariantProduct.init({
//   _id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     primaryKey: true,
//     defaultValue: DataTypes.UUIDV4
//   },
//   variant_id: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },
//   product_id: {
//     type: DataTypes.UUID,
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
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }
// }, {
//   tableName: 'variant_product',
//   sequelize: sequelizeConnection,
//   timestamps: true,
//   createdAt: 'createdAt',
//   updatedAt: 'updatedAt'
// });


// export const associate = (models: any) => {
//   /*************************************
//  * VariantValue associations
//  *************************************/
//   VariantTemplate.belongsTo(models.Category, { foreignKey: 'category_id', targetKey: '_id' });
//   VariantTemplate.hasMany(models.Variant, { foreignKey: 'variant_template_id', sourceKey: '_id' });


//   /*************************************
//  * Variant associations
//  *************************************/
//   Variant.belongsTo(models.VariantTemplate, { foreignKey: 'variant_template_id', targetKey: '_id' });
//   Variant.belongsToMany(models.Product, {
//     through: models.VariantProduct,
//     foreignKey: "variant_id",
//     as: "products",
//   });
// };


// export { Variant, VariantTemplate, VariantProduct };
