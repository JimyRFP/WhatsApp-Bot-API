'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     return await queryInterface.createTable('spc_users', 
      { id: {
           type:Sequelize.INTEGER,
           primaryKey:true,
           autoIncrement:true,
           allowNull:false 
         },
        first_name:{
          type:Sequelize.STRING,
          allowNull:false,
        } ,
        email:{
          type:Sequelize.STRING,
          unique:true,
          allowNull:false,
        },
        password_hash:{
          type:Sequelize.STRING(500),
        },
        is_active:{
          type:Sequelize.BOOLEAN,
          defaultValue:true,
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
     return await queryInterface.dropTable('users');
  }
};
