"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let connected = false;
const con = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "34458",
    database: "students"
});
con.connect((error) => {
    if (error)
        throw error;
    connected = true;
    console.log("Prisijungta");
});
const server = http_1.default.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    let filePath = `public${url}`;
    if (fs_1.default.existsSync(filePath) && fs_1.default.lstatSync(filePath).isFile()) {
        const ext = path_1.default.extname(filePath);
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
        let file = fs_1.default.readFileSync(filePath);
        res.write(file);
        return res.end();
    }
    if (url == '/students' && method == 'GET') {
        if (connected) {
            con.query("SELECT * FROM students ORDER BY name ASC;", (error, result) => {
                if (error)
                    throw error;
                res.setHeader("Content-Type", "text/html; charset=utf8");
                let rows = "";
                result.forEach((s) => {
                    rows += "<tr>";
                    rows += `<td>${s.name}</td> <td>${s.surname}</td> <td>${s.phone}</td> <td> <a href='/student/${s.id}' class="btn btn-success">Placiau</a></td>`;
                    rows += "</tr>";
                });
                let template = fs_1.default.readFileSync('templates/students.html').toString();
                template = template.replace('{{ students_table }}', rows);
                res.write(template);
                res.end();
            });
        }
    }
    if ((url === null || url === void 0 ? void 0 : url.split("/")[1]) == 'student') {
        let id = parseInt(url === null || url === void 0 ? void 0 : url.split("/")[2]);
        con.query(`SELECT * FROM students WHERE id=${id};`, (error, result) => {
            if (error)
                throw error;
            let student = result[0];
            res.setHeader("Content-Type", "text/html; charset=utf8");
            let template = fs_1.default.readFileSync('templates/student.html').toString();
            template = template.replace("{{ name }}", student.name);
            template = template.replace("{{ surname }}", student.surname);
            template = template.replace("{{ phone }}", student.phone != null ? student.phone : '-');
            template = template.replace("{{ sex }}", student.sex != null ? student.sex : '-');
            template = template.replace("{{ birthday }}", student.birthday != null ? student.birthday.toLocaleDateString('lt-LT') : '-');
            template = template.replace("{{ email }}", student.email != null ? student.email : '-');
            res.write(template);
            res.end();
        });
    }
});
server.listen(2999, 'localhost');
