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
    }

    if( pathname.split('.')[1] == "css"){
        //peticion de la hoja css
    }
}).listen(8081);

function collectRequestData(request, callback){
    const FROM_URLUNCODED = 'application/x-www-from-urlencoded';
    
    if(request.headers['content-type']==FROM_URLUNCODED){
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
            msg:`The content-type don't is equals to ${FROM_URLUNCODED}`
        });
    }
}