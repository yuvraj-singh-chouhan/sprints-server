import expressConfig from './config/express';
import sequelizeConnection, { databaseConnection } from './config/sequelize';
import config from './config/config';
import Seed from './services/Seed';

if (config.NODE_ENV !== "test") {
  console.log("*******************", config.NODE_ENV);
  (async () => {
    await databaseConnection();
    // if (config.NODE_ENV !== "test") {
    //   const seed = new Seed();
    //   await seed.sync();
    // }

    await sequelizeConnection.sync({ alter: true });
    const app = expressConfig();
    app.listen(config.port, () => {
      console.log('Server is running on port NODE_ENV ', config.NODE_ENV, config.port);
    });
  })()
}
