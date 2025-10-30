import expressConfig from './config/express';
import sequelizeConnection, { databaseConnection }  from './config/sequelize';
import config from './config/config';

const app = expressConfig();
if(config.NODE_ENV !== "test"){
  console.log("*******************", config.NODE_ENV);
  (async () =>{
    await databaseConnection();
    await sequelizeConnection.sync({alter: true});
    app.listen(config.port, () => {
      console.log('Server is running on port NODE_ENV ', config.NODE_ENV, config.port);
    });
  })()
} else {
  app.listen(config.port, () => {
    console.log('Server is running on port NODE_ENV ', config.NODE_ENV, config.port);
  });
}
