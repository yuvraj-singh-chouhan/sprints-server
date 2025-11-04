import { InferAttributes } from "sequelize";
import { db } from "../config/sequelize";

const { User, Role} = db;

export interface UserType extends InferAttributes<InstanceType<typeof User> /* {omit: "password"} & {passwordResetToken: string | null, passwordResetTokenExpiration: Date | null, address: {line1: string, line2: string, city: string, state: string, country: string, zipCode: string}, gender: 'male' | 'female' | 'other'} */>{
  _id: string;
  role: InferAttributes<InstanceType<typeof Role>>;
}