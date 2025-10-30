import { glob } from "glob";
import { Model, Sequelize } from "sequelize";
import path from "path";
import config from "./config";

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

interface ModelDictionary {
  [key: string]: any;
}

const databaseConnection = async (): Promise<Sequelize> => {
  try {
    await sequelizeConnection.authenticate();
    console.log("Database connection has been established successfully.");

    let db: ModelDictionary = {};
    let associateMethods:any = [];
    const modules = "../modules";
    const schemaFiles = glob.sync(path.join(__dirname, modules, "**/Model.ts"));

    schemaFiles.forEach((schema: string) => {
      const models = require(schema);
      db = { ...db, ...models };
      associateMethods.push(models.associate);
    });

    // Object.keys(db).sort((a: string, b: string) => a.localeCompare(b)).forEach((modelName: string) => {
    //   if (modelName && db[modelName] && typeof db[modelName].associate === "function") {
    //     db[modelName].associate(db);
    //   }
    // });
    associateMethods.forEach((association: any) =>{
      if((association)){
        association(db);
      }
    })
    return sequelizeConnection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    return sequelizeConnection
  }
};


export default sequelizeConnection;
export { databaseConnection };
