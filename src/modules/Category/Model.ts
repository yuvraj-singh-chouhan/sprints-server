import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes, Sequelize } from "sequelize";
import sequelizeConnection from "../../config/sequelize";
import CommonService from "../../services/Global/common";

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare _id: CreationOptional<string>;
  declare title: string;
  declare staticKey: string;
  declare slug: string;
  declare parentCategory_id: string;
  declare isMainCategory: CreationOptional<boolean>;
  declare isDeleted: CreationOptional<boolean>;
  declare status: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export default (sequelize: Sequelize) => {

  Category.init({
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
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentCategory_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    isMainCategory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'categories',
    sequelize: sequelizeConnection,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  Category.addHook("beforeCreate", (attributes: Category) => {
    if (!attributes.parentCategory_id) {
      attributes.parentCategory_id = attributes._id;
      attributes.isMainCategory = true;
    }
    const [slug, staticKey] = CommonService.generateKeyAndSlug(attributes.title);
    attributes.slug = slug;
    attributes.staticKey = staticKey;
  })

  Category.addHook("beforeUpdate", (attributes: Category) => {
    const [slug, staticKey] = CommonService.generateKeyAndSlug(attributes.title);
    attributes.slug = slug;
    attributes.staticKey = staticKey;
  })


  const associate = (modles: any) => {
    Category.hasMany(modles.Category, { foreignKey: 'parentCategory_id', as: 'parentCategory' });
  }

  return { Category, associate };
}





















// import { InferAttributes, InferCreationAttributes, CreationOptional, Model, DataTypes } from "sequelize";
// import sequelizeConnection from "../../config/sequelize";
// import CommonService from "../../services/Global/common";

// class Category extends Model<InferAttributes<typeof Category>, InferCreationAttributes<typeof Category>>{
//   declare _id: CreationOptional<string>;
//   declare title: string;
//   declare staticKey: string;
//   declare slug: string;
//   declare parentCategory_id: string;
//   declare isMainCategory: CreationOptional<boolean>;
//   declare isDeleted: CreationOptional<boolean>;
//   declare status: CreationOptional<boolean>;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
// }

// Category.init({
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
//     allowNull: true
//   },
//   slug: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   parentCategory_id: {
//     type: DataTypes.UUID,
//     allowNull: true
//   },
//   isMainCategory: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
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
//   tableName: 'categories',
//   sequelize: sequelizeConnection,
//   timestamps: true,
//   createdAt: 'createdAt',
//   updatedAt: 'updatedAt'
// });

// Category.addHook("beforeCreate", (attributes: Category) => {
//   if(!attributes.parentCategory_id){
//     attributes.parentCategory_id = attributes._id;
//     attributes.isMainCategory = true;
//   }
//   const [ slug, staticKey ] = CommonService.generateKeyAndSlug(attributes.title);
//   attributes.slug = slug;
//   attributes.staticKey = staticKey;
// })

// Category.addHook("beforeUpdate", (attributes: Category) => {
//   const [ slug, staticKey ] = CommonService.generateKeyAndSlug(attributes.title);
//   attributes.slug = slug;
//   attributes.staticKey = staticKey;
// })






// export const associate = (modles: any) =>{
//   Category.hasMany(modles.Category, {foreignKey: 'parentCategory_id', as: 'parentCategory'});  
// }

// export { Category };
