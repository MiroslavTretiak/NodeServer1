
import mysql from 'mysql2';
import { Student } from './models/student';
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


if(url=='/students' && method=='GET'){
if (connected){
con.query<Student[]>("SELECT * FROM students ORDER BY name ASC;", (error,result)=>{
        if(error) throw error;
        res.setHeader("Content-Type", "text/html; charset=utf8");
        let rows="";
        result.forEach((s)=>{
            rows+="<tr>"
            rows+=`<td>${s.name}</td> <td>${s.surname}</td> <td>${s.phone}</td> <td> <a href='/student/${s.id}' class="btn btn-success">Placiau</a></td>`;
            rows+="</tr>"
        });
        let template =fs.readFileSync('templates/students.html').toString();
        template=template.replace('{{ students_table }}', rows)
        res.write(template);
        res.end();

     })
     }
    }
if( url?.split("/")[1] == 'student') {
    let id = parseInt(url?.split("/")[2]);
    con.query<Student[]>(`SELECT * FROM students WHERE id=${id};`, (error,result)=>{
        if(error) throw error;
        let student=result[0];
        res.setHeader("Content-Type", "text/html; charset=utf8");

        let template =fs.readFileSync('templates/student.html').toString();
        template=template.replace("{{ name }}", student.name);
        template=template.replace("{{ surname }}", student.surname);
        template=template.replace("{{ phone }}", student.phone!=null?student.phone:'-');
        template=template.replace("{{ sex }}", student.sex!=null?student.sex:'-');
        template=template.replace("{{ birthday }}", student.birthday!=null?student.birthday.toLocaleDateString('lt-LT'):'-');
        template=template.replace("{{ email }}", student.email!=null?student.email:'-');
        res.write(template);
        res.end();
})
}

});



server.listen(2999, 'localhost');


