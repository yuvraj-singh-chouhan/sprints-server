import { db } from "../config/sequelize";


const { Role } = db;

class Seed{
  async sync(){
    await this.createDefaultRole();
  }

  async createDefaultRole(){
    try {
      const DefaultRoles = ["Super Admin", "Vendor", "User"];
      for (const role of DefaultRoles) {
        const staticKey: string = role.toLowerCase().split(' ').join('-');
        const defaultRole: typeof Role | null = await Role.findOne({ where: { staticKey } });
        if(!defaultRole){
          await Role.create({
            title: role,
            staticKey,
            permissions: [],
            isDefault: true,
          });
        }
      }
      console.log("Default Role Created");
    } catch (error) {
      console.log("Error in createDefaultRole", error)
    }
  }
}

export default Seed;


