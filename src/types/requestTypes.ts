import { Request } from "express";
import { InferAttributes } from "sequelize";
import { db } from "../config/sequelize";

const { Role, User } = db;

export interface RequestType extends Request {
  currentUser: JwtPayloadType;
}

export interface JwtPayloadType extends InferAttributes<typeof User, {omit: "password"} & { passwordResetToken: string | null, passwordResetTokenExpiration: Date | null, address: {line1: string, line2: string, city: string, state: string, country: string, zipCode: string}, gender: 'male' | 'female' | 'other'}>{
  Role: InferAttributes<typeof Role>
};