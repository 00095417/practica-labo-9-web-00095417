const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      {parse} = require('querystring');

mimeType = {
    "html":"text/html",
    "jpeg":"image/jpeg",
    "jpg":"image/jpeg",
    "png":"image/png",
    "js":"text/javascript",
    "css":"text/css"
};

http.createServer((req, res)=>{
    //control code.
    var pathname = url.parse(req.url).pathname;
    
    if (pathname == "/"){
        pathname = "../index.html";
    }

    if (pathname == "../index.html"){
        //peticion a la pagina principal
        fs.readFile(pathname, (err, data)=>{
            if (err){
                console.log(err)
                //HTTP Status: 404 : NOT FOUND
                //en caso de no haberse encontrado el archivo
                res.writeHead(404,{
                    'Content-Type':'text/html'
                });
                return res.end("404 Not Found");
            }
            //pagina encontrada 
            //HTTP Status: 200: ok
            res.writeHead(200,{
                'Content-Type' : mimeType[pathname.split('.').pop()] || 'text/html'
            });
            //escribe el contenido de la data en el body de la respuesta
            res.write(data.toString());
            //envia la respuesta
            return res.end();
        });
    }

    if (req.method === 'POST' && pathname === '/cv'){
        //peticion del formulario a traves del metodo POST
        collectRequestData(req, (err,result)=>{
            if (err){
                res.writeHead(404,{
                    'Content-Type':'text/html'
                });
                return res.end('Bad Request');
            }
            fs.readFile("../templates/plantilla.html", function(err,data){
                if (err){
                    console.log(err);
                    //HTTP Status: 404 : NOT FOUND
                    //Content Type: text/plain
                    res.writeHead(404,{
                       'Content-Type':'text/html' 
                    });
                    return res.end("404 Not Found");
                }
                res.writeHead(200,{
                    'Content-Type':mimeType[pathname.split('.').pop()] || 'text/html'
                });
                //variables de control
                let parsedData = data.toString().replace("${dui}",result.dui)
                                 .replace("${lastname}",result.lastname)
                                 .replace("${firstname}",result.firstname)
                                 .replace("${gender}",result.gender)
                                 .replace("${civilStatus}",result.civilStatus)
                                 .replace("${birth}",result.birth)
                                 .replace("${exp}",result.exp)
                                 .replace("${tel}",result.tel)
                                 .replace("${std}",result.std);
                res.write(parsedData);
                res.end();
            });
        });
    }

    if( pathname.split('.')[1] == "css"){
        //peticion de la hoja css
        fs.readFile(".."+pathname, (err,data)=>{
            if (err){
                console.log(err);
                res.writeHead(404,{
                    'Content-Type':'text/html'
                });
                return res.end("404 Not Found");
            }
            res.writeHead(200,{
                'Content-Type':mimeType[pathname.split('.').pop()] || 'text/css'
            });
            //escribe el contenido de la data en el body de la respuesta
            res.write(data.toString());
            //envia la respuesta
            return res.end();
        });
    }
}).listen(8081);

function collectRequestData(request, callback){
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
   if(request.headers['content-type']===FORM_URLENCODED){
        let body = '';
        //evento de acumulacion de data.
        request.on('data', chunk =>{
            body += chunk.toString();
        });
        //data completamente recibida
        request.on('end', ()=>{
            callback(null, parse(body));
        });
    }else{
        callback({
            msg:`The content-type don't is equals to ${FORM_URLENCODED}`
        });
    }
}