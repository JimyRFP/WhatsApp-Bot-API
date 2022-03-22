'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     return await queryInterface.createTable('vs_venom_session',{
        id: {
          type:Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
          allowNull:false 
        },
        session_name:{
           type:Sequelize.STRING,
           unique:true,
           allowNull:false,
        },
        browser_pid:{
           type:Sequelize.STRING,
           allowNull:false,
        },
        created_at:{
          type:Sequelize.DATE,
          allowNull:false,
        },
        updated_at:{
          type:Sequelize.DATE,
          allowNull:false,
        },

     });
  },

  async down (queryInterface, Sequelize) {
     return await queryInterface.dropTable('vs_venom_session');

  }
};
