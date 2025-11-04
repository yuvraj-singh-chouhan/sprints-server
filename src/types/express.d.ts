import { JwtPayloadType } from "./requestTypes";

declare global {
  namespace Express {
    interface Request {
      currentUser: JwtPayloadType
    }
  }
}


export { };