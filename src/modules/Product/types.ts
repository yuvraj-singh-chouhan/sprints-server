import { Attributes } from "sequelize";
import { db } from "../../config/sequelize";
// import { Product } from "./Model";

const { Product } = db;

export interface ProductVariant extends Attributes<typeof Product>{
  variant_ids: string[]
}