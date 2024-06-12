var express = require("express");
var cors = require("cors");
var path = require("path");
var porta = 3333;
var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post('/usuarios/entrar', (req, res) => {
    res.json({ message: 'Login realizado com sucesso' });
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/html/login.html"));
});

app.listen(porta, function () {
    console.log(`Acesse o site: http://localhost:${porta}`);
});
