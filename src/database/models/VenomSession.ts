import { Model } from "sequelize";
import { DataTypes } from "sequelize";
import { dataBase } from "serverpreconfigured";
export class VenomSession extends Model{
   declare browser_pid:string;
}
VenomSession.init({
    session_name:DataTypes.STRING,
    browser_pid:DataTypes.STRING,
 },
 {
     sequelize:dataBase,
     tableName:'vs_venom_session'
 }
);