import _ from 'lodash'
import { glob } from "glob";
import { Model, ModelAttributes, ModelStatic, Sequelize } from "sequelize";
import path from "path";
import config from "./config";

import { Product, ProductItem } from "../modules/Product/Model"
import { Variant, VariantProduct, VariantTemplate } from "../modules/Variant/Model"
import { Permission, Role } from "../modules/Roles/Model"
import { User } from "../modules/Users/Model"
import { AuthenticationToken } from "../modules/Authentication/Model"
import { Category } from "../modules/Category/Model"
import { Cart, CartItem } from '../modules/Cart/Model';

const db_name: string = config.db_name!;
const db_user: string = config.db_user!;
const db_password: string = config.db_password!;
const db_host: string = config.db_host!;
const db_port: string = config.db_port!;

const sequelizeConnection = new Sequelize(db_name, db_user, db_password, {
  dialect: "postgres",
  host: db_host,
  port: Number(db_port),
  logging: false,
  sync: { force: false }
});

interface dbModels {
  Product: ModelStatic<Product>
  Variant: ModelStatic<Variant>,
  VariantTemplate: ModelStatic<VariantTemplate>,
  Role: ModelStatic<Role>,
  Permission: ModelStatic<Permission>,
  User: ModelStatic<User>,
  AuthenticationToken: ModelStatic<AuthenticationToken>,
  Category: ModelStatic<Category>,
  VariantProduct: ModelStatic<VariantProduct>
  Cart: ModelStatic<Cart>,
  CartItem: ModelStatic<CartItem>,
  ProductItem: ModelStatic<ProductItem>
}


let database: Partial<dbModels> = {};

const databaseConnection = async (): Promise<typeof database> => {
  try {
    await sequelizeConnection.authenticate();
    console.log("Database connection has been established successfully.");

    let associateMethods: any = [];
    const modules = "../modules";
    const schemaFiles = glob.sync(path.join(__dirname, modules, "**/Model.ts"));

    schemaFiles.forEach((schema: string) => {
      const modelModule = require(schema);
      if (typeof modelModule?.default === "function") {
        const initialized = modelModule.default(sequelizeConnection);
        const associateMethod = initialized.associate;
        delete initialized.associate;
        Object.assign(database, initialized);

        // store associate methods (if exported)
        if (typeof associateMethod === "function") {
          associateMethods.push(associateMethod);
        }
      }
    });

    associateMethods.forEach((association: any) => {
      if ((association)) {
        association(database);
      }
    })
    return database;
  } catch (error) {
    console.error("Error connecting to database:", error);
    return database
  }
};




export default sequelizeConnection;
export { databaseConnection, database };


export const db = new Proxy({} as dbModels, {
  get(_, key: keyof dbModels) {
    if (!database) {
      throw new Error(`Database not initialized! Tried to access db.${String(key)} before initializeDatabase().`);
    }
    return database[key];
  },
});