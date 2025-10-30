import { Attributes } from "sequelize";
import { Product } from "./Model";

export interface ProductVariant extends Attributes<Product>{
  variant_ids: string[]
}