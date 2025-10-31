import _ from "lodash"
import { Attributes, Op, WhereOptions } from "sequelize";
import PorductRepository from "./Repository";
import CommonService from "../../services/Global/common";
import { ProductVariant } from "./types";
import { Request } from "express";
import { db } from "../../config/sequelize";

const { Product, Variant } = db;

export default class ProductService{
  Repository: PorductRepository
  req: Request

  constructor(request: Request){
    this.req = request;
    this.Repository = new PorductRepository();
  }

  async addProduct(data: ProductVariant): Promise<Attributes<typeof Product> | null>{
    const [ staticKey, slug] =  CommonService.generateKeyAndSlug(data.name);
    let totalProducts: number = await this.Repository.findProductCount();
    let productSKU = this.createSKU(data.name, totalProducts);
    console.log(productSKU)
    const createdBy = this.req.currentUser._id;
    const productDetails = {
      ...data,
      SKU: productSKU,
      slug,
      staticKey,
      vendor_id: createdBy,
      createdBy,
      totalProductCount: totalProducts
    }

    const query: WhereOptions = {
      SKU: productDetails.SKU,
      isDeleted: false
    }

    const alredyExistProduct = this.Repository.checkAlreadyExist(Product, query)
    if(!_.isEmpty(alredyExistProduct)){
      throw new Error("ConflictError");
    }

    const newProduct:typeof Product = await Product.create(productDetails);
    const variants: typeof Variant[] = await Variant.findAll({ where :{ _id: { [Op.in]: productDetails.variant_ids} }})
    if(variants.length){
      await newProduct.addVariants(variants);
    }

    return null;
  }


  createSKU(title: string, totalProducts: number){
    return "SKU-" + title.split(" ").map((wrd) => (wrd.slice(0, 1).toUpperCase())).join("") + "-" + totalProducts;
  }
}
