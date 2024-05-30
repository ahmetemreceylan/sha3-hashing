const http = require("http");
const fs = require("fs");
const crypto = require("crypto");
const server = http.createServer((request,response)=>{

    if(request.url=="/" && request.method=="GET"){
        fs.readFile("index.html",(err,content)=>{
            if(err){
                console.error(err);
            }
            else{
                response.writeHead(200,{"Content-Type":"text/html"});
                response.write(content);
                response.end();
            }
        });
    }
    else if(request.url.split(".").at(-1)=="css"){
        fs.readFile("."+request.url,(err,content)=>{
            if(err){
                console.error(err);
            }
            else{
                response.writeHead(200,{"Content-Type":"text/css"});
                response.write(content);
                response.end();
            }
        });
    }
    else if(request.url.split(".").at(-1)=="js"){
        fs.readFile("."+request.url,(err,content)=>{
            if(err){
                console.error(err);
            }
            else{
                response.writeHead(200,{"Content-Type":"text/javascript"});
                response.write(content);
                response.end();
            }
        });
    }
    else if(request.url.split(".").at(-1)=="ttf"){
        fs.readFile("."+request.url,(err,content)=>{
            if(err){
                console.error(err);
            }
            else{
                response.writeHead(200,{"Content-Type":"font/ttf"});
                response.write(content);
                response.end();
            }
        });
    }
    else if(request.url=="/send-text" && request.method == "POST"){
        let data=[];
        request.on("data",(chunk)=>{
            data.push(chunk);
        });
        request.on("end",()=>{
            data = Buffer.concat(data);
            data = JSON.parse(data);
            const temp = ["224","256","384","512"];
            if(temp.includes(data.bit)){
                const hash = crypto.createHash(`sha3-${data.bit}`).update(data.content).digest('hex');
                response.writeHead(200,{"Content-Type":"text/plain"});
                response.write(hash);
                response.end();
            }
            else{
                response.writeHead(400,{"Content-Type":"text/plain"});
                response.write(data.bit + " is unacceptable value");
                response.end();
            }
        });
    }
    else if(request.url=="/send-file" && request.method == "POST"){
        let data = [];
        request.on("data",(chunk)=>{
            data.push(chunk);
        });
        request.on("end",()=>{
            data = Buffer.concat(data);
            const temp = ["224","256","384","512"];
            if(temp.includes(request.headers.bit)){
                const hash = crypto.createHash(`sha3-${request.headers.bit}`).update(data).digest('hex');
                response.writeHead(200,{"Content-Type":"text/plain"});
                response.write(hash);
                response.end();
            }
            else{
                response.writeHead(400,{"Content-Type":"text/plain"});
                response.write(request.headers.bit + " is unacceptable value");
                response.end();
            }
        });
    }
    else{
        response.statusCode=404;
        response.statusMessage="Not Found!";
        response.end();
    }
});
const port = 2828;
server.listen(port,()=>{
    console.warn("Port " + port + " listening");
});