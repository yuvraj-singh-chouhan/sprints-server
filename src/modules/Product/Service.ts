import _ from "lodash"
import { Attributes, FindOptions, Model, Op, WhereOptions } from "sequelize";
import PorductRepository from "./Repository";
import CommonService from "../../services/Global/common";
import { Pagination, ProductVariant } from "./types";
import { Request } from "express";
import { db } from "../../config/sequelize";

const { Product, Variant, User } = db;

export default class ProductService {
  Repository: PorductRepository
  req: Request

  constructor(request: Request) {
    this.req = request;
    this.Repository = new PorductRepository();
  }

  async addProduct(data: ProductVariant): Promise<Attributes<InstanceType<typeof Product>> | null> {
    const [staticKey, slug] = CommonService.generateKeyAndSlug(data.name);
    let totalProducts: number = await this.Repository.findProductCount();
    let productSKU = this.createSKU(data.name, totalProducts);
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
    if (!_.isEmpty(alredyExistProduct)) {
      throw new Error("ConflictError");
    }

    const newProduct: InstanceType<typeof Product> = await Product.create(productDetails);
    const variants: InstanceType<typeof Variant>[] = await Variant.findAll({ where: { _id: { [Op.in]: productDetails.variant_ids } } })
    if (variants.length) {
      await newProduct.addVariants(variants);
    }

    return newProduct;
  }

  async listing(data: Pagination): Promise<Attributes<InstanceType<typeof Product>>[] | []> {
    const [query, limit, offset] = CommonService.generateListingQuery(data, ["name"]);
    const productListing: Attributes<InstanceType<typeof Product>>[] | [] = await this.Repository.handleProductListing(query, { limit, offset });
    return productListing;
  }

  /**
 * Handle Add Variant from admin side
 * @returns 
 */
  async handleUpdateProduct(data: Attributes<InstanceType<typeof Product>>): Promise<[affectedCount: number]> {
    const { SKU, _id } = data;
    const query: WhereOptions = {
      SKU,
      isDeleted: false,
      _id: data._id
    }
    const checkAlreadyExist: Model<typeof Product> | null = await this.Repository.checkAlreadyExist(Product, query)
    if (!_.isEmpty(checkAlreadyExist)) {
      const results: [affectedCount: number] = await this.Repository.updateProduct(data, query);
      if (!_.isEmpty(results)) {
        return results;
      }
    }
    throw new Error(i18n.__("FAILED_TO_UPDATE_DATA"));
  }

  async handleProductDetails(id: string): Promise<Attributes<InstanceType<typeof Product>> | null> {
    const query: FindOptions = {
      where: { _id: id },
      include: [
        { model: Variant, as: 'variants' },
        { model: User, as: "vendor" }
      ]
    }

    const productDetails: Attributes<InstanceType<typeof Product>> | null = await this.Repository.productDetails(query)

    return productDetails;
  }
  createSKU(title: string, totalProducts: number) {
    return "SKU-" + title.split(" ").map((wrd) => (wrd.slice(0, 1).toUpperCase())).join("") + "-" + totalProducts;
  }
}
