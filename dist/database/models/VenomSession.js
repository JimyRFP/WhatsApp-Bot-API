"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const serverpreconfigured_1 = require("serverpreconfigured");
class VenomSession extends sequelize_1.Model {
}
exports.VenomSession = VenomSession;
VenomSession.init({
    session_name: sequelize_2.DataTypes.STRING,
    browser_pid: sequelize_2.DataTypes.STRING,
}, {
    sequelize: serverpreconfigured_1.dataBase,
    tableName: 'vs_venom_session'
});
