import { DataTypes, QueryInterface, Sequelize } from "sequelize"

export default {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('User', "organiztaionName", { type: DataTypes.STRING })
      ])
    })
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("User", "organizationName")
      ])
    })
  }
};
