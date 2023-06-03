const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('qs');
const port = 8080;
let handlers = {};
const server = http.createServer((req, res) => {
    let urlPathName = url.parse(req.url).pathname;
    if (req.method === "GET") {
        let choseHandlers = (typeof router[urlPathName] !== 'undefined') ? router[urlPathName] : handlers.notFound;
        choseHandlers(req, res)
    } else {
        let choseHandler = handlers.profile;
        choseHandler(req, res);
    }
})
server.listen(port, 'localhost', () => {
    console.log(`Server is running at http://localhost:${port}`)
})

handlers.home = (req, res) => {
    fs.readFile('./views/home.html', "utf-8", (err, dataHTML) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(dataHTML);
        return res.end();
    })
}

handlers.login = (req, res) => {
    fs.readFile('./views/login.html', "utf-8", (err, dataHTML) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(dataHTML);
        return res.end();
    })
}
handlers.notFound = (req, res) => {
    fs.readFile('./views/notfound.html', "utf-8", (err, dataHTML) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(dataHTML);
        return res.end();
    })
}
handlers.profile = (req, res) => {
    let data = '';
    req.on("data", chunk => {
        data += chunk
    })
    req.on("end", () => {
        let dataParse = qs.parse(data);
        let name = dataParse.name;
        let stringDisplayAtProfile = '<h1>Hello ' + name + '</h1>'
        fs.writeFile('./views/profile.html',stringDisplayAtProfile,(err)=>{
            if(err){
                console.log(err.message)
            } else {
                fs.readFile('./views/profile.html', "utf-8", (err, dataHTML) => {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(dataHTML);
                    return res.end();
                })
            }
        })
    })
    req.on("error", () => {
        console.log("Error")
    })
}
let router = {
    '/home': handlers.home,
    '/login': handlers.login,
    '/profile': handlers.profile
}
