import _ from "lodash"
import { Attributes, FindOptions, Model, ModelAttributes, Op, WhereOptions } from "sequelize";
import PorductRepository from "./Repository";
import CommonService from "../../services/Global/common";
import { Pagination, ProductItem } from "./types";
import { Request } from "express";
import { db } from "../../config/sequelize";
import { Product as ProductType } from "./Model";
import { Variant as VariantType } from "../Variant/Model";

const { Product, Variant, User, ProductItem } = db;

export default class ProductService {
  Repository: PorductRepository
  req: Request

  constructor(request: Request) {
    this.req = request;
    this.Repository = new PorductRepository();
  }

  async addProduct(data: ProductItem): Promise<Attributes<InstanceType<typeof ProductItem>> | null> {
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

    let productItem: InstanceType<typeof ProductItem> | InstanceType<typeof ProductItem> | null  = null;

    if(!data._id){
      const [newProduct, variants]: [InstanceType<typeof Product> | null, InstanceType<typeof Variant>[]] = await Promise.all([
        await this.Repository.addData(Product, productDetails),
        await this.Repository.getListingData(Variant, { where: { _id: { [Op.in]: productDetails.variant_ids } } })
      ])
      if (variants.length && newProduct) {
        const variantTitles = variants.map(variant => variant.title)
        productItem = await this.Repository.addData(ProductItem, {
          ...productDetails,
          SKU: this.createSKU(data.name, totalProducts, variantTitles),
          product_id: newProduct._id,
          vendor_id: createdBy,
          createdBy,
        });

        if(productItem) productItem.addVariants(variants);
      }
    } else {
      const query: WhereOptions = {
        _id: data._id,
        isDeleted: false
      }
      // const selectedProduct = this.Repository.checkAlreadyExist(Product, query);
      const [ selectedProduct, variants ]: [ ProductType | null, VariantType[] ] = await Promise.all([
        this.Repository.checkAlreadyExist<ProductType>(Product, query),
        this.Repository.getListingData<VariantType>(Variant, { where: { _id: { [Op.in]: productDetails.variant_ids } } })
      ])

      if (variants.length && selectedProduct) {
        const variantTitles = variants.map(variant => variant.title)
        productItem = await this.Repository.addData(ProductItem, {
          ...productDetails,
          SKU: this.createSKU(data.name, totalProducts, variantTitles),
          product_id: selectedProduct._id,
          vendor_id: createdBy,
          createdBy,
        });

        if(productItem) productItem.addVariants(variants);
      }
    }
    return productItem;

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
    const query: WhereOptions = {
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

  createSKU(title: string, totalProducts: number, variantTitles?: string[]) {
    if(variantTitles && variantTitles.length <= 0)
      return "SKU-" + title.split(" ").map((wrd) => (wrd.slice(0, 1).toUpperCase())).join("") + "-" + totalProducts;
    return 'SKU-' + title.split(" ").map((wrd) => (wrd.slice(0, 3).toUpperCase())).join("") + "-" + variantTitles?.map((variantTitle: string) => !isNaN(parseInt(variantTitle)) ? variantTitle.slice(0, 4).toUpperCase() : variantTitle).join("");
  }
}
