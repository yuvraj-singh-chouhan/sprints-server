import { DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Model, ForeignKey, BelongsToGetAssociationMixin, Sequelize } from "sequelize";
import { db } from "../../config/sequelize";

const { User } = db;

class AuthenticationToken extends Model<InferAttributes<AuthenticationToken>, InferCreationAttributes<AuthenticationToken>> {
  declare _id?: CreationOptional<string>;
  declare userId: ForeignKey<typeof User['_id']>;
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

  AuthenticationToken.belongsTo(User);
  return { AuthenticationToken };
}


