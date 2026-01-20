import { Attributes } from "sequelize";
import { db } from "../../config/sequelize";
const { Product, Variant, VariantTemplate, Category, Role, ProductItem, } = db;

export interface ProductItem extends Attributes<InstanceType<typeof ProductItem>>{
  variant_ids: string[],
  quantity: number,
  name: string,
  description: string,
  
}

export interface Product extends Attributes<InstanceType<typeof Product>>{
  variant_ids: string[]
}


export type ModelAttributes<T extends abstract new (...args: any) => any> = Attributes<InstanceType<T>>; 

export type Pagination = {
  page: number,
  pageSize: number,
  searchText: string,
  filter: Attributes<InstanceType<typeof Product> | InstanceType<typeof Variant> | InstanceType<typeof VariantTemplate> | InstanceType<typeof Category> | InstanceType<typeof Role> | InstanceType<typeof ProductItem>>
}