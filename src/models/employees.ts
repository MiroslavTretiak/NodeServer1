import { RowDataPacket } from "mysql2";

export interface Employees extends RowDataPacket {
    id?:number;
    name:string;
    surname:string;
    phone?:string;
    gender?:string;
    birthday?:Date;
    education:string;
    salary:number;
}