import {  Response, Request } from "express"
import i18n from 'i18n';
import { Op, WhereOptions, FindOptions } from "sequelize";

class CommonService{

  /**
   *
   * @param res response object
   * @param message message to send
   * @param status status code
   * @param resStatus response status
   * @param data data to send
   * @returns
   */
  static  handleResponse(res: Response | Response, message: string, status:number, resStatus: boolean, data?: any){
    return res
            .status(status)
            .send({status: resStatus, message: i18n.__(message), data});
  }


  /**
   * @param processBody array of keys to process from request body
   * @param reqBody request body
   * @returns processed data
   */
  static processBody(processBody: string[], reqBody: Request['body']){
    return processBody.reduce((acc: any, key: string) => {
      if (reqBody[key]) {
        acc[key] = reqBody[key];
      }
      return acc;
    }, {});
  }


  /**
   * @param title title to generate static key
   * @returns static key
   */
  static generateKeyAndSlug(title: string): [string, string]{
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
    const staticKey = title.toLowerCase().replace(/\s+/g, "-");
    return [slug, staticKey];
  }

  /**
   *
   * @param body
   * @returns
   */
  static generateListingQuery(body: any, searchabelField: string[]): [FindOptions, number, number]{
    const { page, pageSize, searchText, filters } = body;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const query: WhereOptions = { where: {} };

    if(filters && filters.length > 0){
      const andQuery = this.constructFilterQuery(filters);
      query.where = {...query.where, ...andQuery};
    }
    if(searchText){
      const orQuery = this.generateSearchText(searchabelField, searchText);
      query.where = {...query.where, ...orQuery};
    }

    return [query, limit, offset];
  }

  static generateSearchText(searchabelField: string[], searchText: string): WhereOptions{
    let orQuery: WhereOptions = searchabelField.map((field: string) => ({
        [field]: {
          [Op.iLike]: `%${searchText.trim()}%`
        }
      })
    )
    return {[Op.or]: orQuery};
  }

  static constructFilterQuery<T>(filters: T[]): WhereOptions {
    let query: WhereOptions = {};
    for (let filter of filters) {
      const obj = filter;
      for (let k in filter) {
        if (Array.isArray(obj[k])) [
          query["where"] = {
            [k]: {
              [Op.in]: obj[k]
            }
          }
        ]
        else {
          query['where'] = {
            ...query.where,
            [k]: {
              [Op.eq]: obj[k]
            }
          }
        }
      }
    }
    return query;
  }

}

export default CommonService;