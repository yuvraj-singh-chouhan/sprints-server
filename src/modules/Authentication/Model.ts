import { DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Model, ForeignKey, BelongsToGetAssociationMixin, Sequelize } from "sequelize";
import { db } from "../../config/sequelize";

const { User } = db;

export class AuthenticationToken extends Model<InferAttributes<AuthenticationToken>, InferCreationAttributes<AuthenticationToken>> {
  declare _id?: CreationOptional<string>;
  declare userId: string;
  declare deviceId: string;
  declare token: string;
  declare ipAddress: CreationOptional<string>;
  declare refreshToken: string;

  declare getUsers: BelongsToGetAssociationMixin<typeof User>
}

export default (sequelizeConnection: Sequelize) => {
  AuthenticationToken.init({
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "web"
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: "authenticationtokens",
    sequelize: sequelizeConnection,
    timestamps: true,
  })

  const associate = (models: any) => {
    models.AuthenticationToken.belongsTo(models.User);
  }
  return { AuthenticationToken, associate };
}


