import { Request } from "express";
import { Attributes, InferAttributes, Model } from "sequelize";
import { db } from "../config/sequelize";

const { Role, User } = db;

export interface RequestType extends Request {
  currentUser: JwtPayloadType;
}

export interface JwtPayloadType extends Attributes<InstanceType<typeof User> /* {omit: "password"} & { passwordResetToken: string | null, passwordResetTokenExpiration: Date | null, address: {line1: string, line2: string, city: string, state: string, country: string, zipCode: string}, gender: 'male' | 'female' | 'other'} */>{
  Role: Attributes<InstanceType<typeof Role>>
};

// export interface dbType {
//   Product: Model,
//   Variant: Model,
//   VariantTemplate: Model,
//   Role: Model,
//   Permission: Model,
//   User: Model,
//   ProductItem: Model
//   [key: string]: any;
// };