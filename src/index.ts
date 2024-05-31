
import mysql from 'mysql2';
import { Employees} from './models/employees';
import http from 'http';
import fs from 'fs';
import path from 'path';


let connected =false;

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"34458",
    database:"students"
});

con.connect((error:any)=>{
    if(error) throw error;

    connected=true;

    console.log("Prisijungta")
});



const server=http.createServer((req, res)=>{
    const url=req.url;
    const method=req.method;

let filePath=`public${url}`;
if (fs.existsSync(filePath)&& fs.lstatSync(filePath).isFile()){
    const ext=path.extname(filePath);
    switch (ext) {
        case ".css":
            res.setHeader("Content-Type", "text/css; charset=utf8");
            break;
        case ".js":
            res.setHeader("Content-Type", "application/javascript; charset=utf8");
            break;
        case ".jpg":
        case ".png":
        case ".jpeg":
            res.setHeader("Content-Type", "image/jpg; charset=utf8");
            break;
    }
     let file =fs.readFileSync(filePath)
        res.write(file);
        return res.end();
}


if(url=='/employees' && method=='GET'){
if (connected){
con.query<Employees[]>("SELECT * FROM employees ORDER BY name ASC;", (error,result)=>{
        if(error) throw error;
        res.setHeader("Content-Type", "text/html; charset=utf8");
        let rows="";
        result.forEach((s)=>{
            rows+="<tr>"
            rows+=`<td>${s.name}</td> <td>${s.surname}</td> <td>${s.phone}</td> <td> <a href='/employee/${s.id}' class="btn btn-success">Placiau</a></td>`;
            rows+="</tr>"
        });
        let template =fs.readFileSync('templates/employees.html').toString();
        template=template.replace('{{ employees_table }}', rows)
        res.write(template);
        res.end();

     })
     }
    }
if( url?.split("/")[1] == 'employee') {
    let id = parseInt(url?.split("/")[2]);
    con.query<Employees[]>(`SELECT * FROM employees WHERE id=${id};`, (error,result)=>{
        if(error) throw error;
        let employee=result[0];
        res.setHeader("Content-Type", "text/html; charset=utf8");

        let template =fs.readFileSync('templates/employee.html').toString();
        template=template.replace("{{ name }}", employee.name);
        template=template.replace("{{ surname }}", employee.surname);
        template=template.replace("{{ phone }}", employee.phone || '-');
        template=template.replace("{{ gender }}", employee.gender ||'-');
        template=template.replace("{{ birthday }}", employee.birthday ? employee.birthday.toLocaleDateString('lt-LT'):'-');
        template=template.replace("{{ education }}", employee.education || '-');
        template=template.replace("{{ salary }}", employee.salary.toString());
        res.write(template);
        res.end();
})
}

});



server.listen(2999, 'localhost');


