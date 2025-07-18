
const http = require("http");
const url = require("url");


let products = [
    { id: 1, name: "Laptop", narxi: 15000, url: "http://localhost:3000/products/1" },
    { id: 2, name: "Phone", narxi: 15000, url: "http://localhost:3000/products/2" },
    { id: 3, name: "Tablet", narxi: 12000, url: "http://localhost:3000/products/3" },
    { id: 4, name: "Smartwatch", narxi: 8000, url: "http://localhost:3000/products/4" },
    { id: 5, name: "Headphones", narxi: 5000, url: "http://localhost:3000/products/5" }
];
let users = [
    { id: 1, username: "odillbek" },
    { id: 2, username: "gulomov" },
    { id: 3, username: "sardor" },
    { id: 4, username: "sardorbek" },
    { id: 5, username: "sardorbek2" }
];

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const method = req.method;


    if (method === "OPTIONS" && parts[0] === "products") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        return res.end();
    }


    if (method === "HEAD" && parsed.pathname === "/products") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end();
    }


    if (method === "GET" && parts[0] === "products") {
        if (parts.length === 1) {

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(products));
        } else {

            const id = Number(parts[1]);
            const prod = products.find(p => p.id === id);
            if (prod) {
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify(prod));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Product not found" }));
            }
        }
    }


    if (method === "POST" && parsed.pathname === "/products") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const newProd = JSON.parse(body);
                newProd.id = products.length ? products[products.length - 1].id + 1 : 1;
                newProd.url = `http://localhost:3000/products/${newProd.id}`;
                products.push(newProd);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify(newProd));
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });
        return;
    }


    if (method === "PUT" && parts[0] === "products" && parts[1]) {
        const id = Number(parts[1]);
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const updated = JSON.parse(body);
                const idx = products.findIndex(p => p.id === id);
                if (idx !== -1) {
                    updated.id = id;
                    updated.url = `http://localhost:3000/products/${id}`;
                    products[idx] = updated;
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify(updated));
                } else {
                    throw new Error("Not found");
                }
            } catch (e) {
                const status = e.message === "Not found" ? 404 : 400;
                res.writeHead(status, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }


    if (method === "PATCH" && parts[0] === "products" && parts[1]) {
        const id = Number(parts[1]);
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const updates = JSON.parse(body);
                const prod = products.find(p => p.id === id);
                if (prod) {
                    Object.assign(prod, updates);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify(prod));
                } else {
                    throw new Error("Not found");
                }
            } catch (e) {
                const status = e.message === "Not found" ? 404 : 400;
                res.writeHead(status, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }


    if (method === "DELETE" && parts[0] === "products" && parts[1]) {
        const id = Number(parts[1]);
        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
            const deleted = products.splice(idx, 1)[0];
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(deleted));
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Product not found" }));
        }
    }


    if (method === "GET" && parsed.pathname === "/users") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(users));
    }


    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
});


server.listen(3000, () => {
    console.log("Server http://localhost:3000 da ishlayapti");
});
