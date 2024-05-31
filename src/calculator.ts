import http from 'http';
import fs from 'fs';

const server=http.createServer((req, res)=>{

    const method=req.method;
    const url=req.url;
    console.log(`Metodas: ${method}, URL: ${url}`);

    if(url=='/calculate' && method=='POST'){

    const reqBody:any[]=[];
    req.on('data', (d)=>{
        console.log(`Duomenys: ${d}`)
        reqBody.push(d);
    });
    req.on('end',()=>{
        console.log("Baigtis siusti duomenys");

        const reqData=Buffer.concat(reqBody).toString();
        const va=reqData.split('&');
        const x=parseFloat(va[0].split('=')[1]);
        const y=parseFloat(va[1].split('=')[1]);
        console.log(`Visi gauti duomenys: ${reqData}`)
        console.log(va)
        res.write(`Rezultatas: ${x*y}`);
        res.end();
    });
    return;
}
    if(url=='/'){



    res.setHeader('Content-Type','text/html; charset=utf-8');
    const template = fs.readFileSync('templates/index.html');
    res.write(template)
    return res.end();
    }

    res.write('Puslapis nerastas');
    res.statusCode=404;
    res.end();

});

server.listen(2999, 'localhost')