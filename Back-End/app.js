const express = require("express");
var cors = require("cors");
const app = express();
require("dotenv").config();
const { validarToken } = require('./middlewares/Auth');
const router = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,DELETE,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  app.use(cors());
  next();
});

app.get("/", function (request, response) {
  response.send("Serviço de API Iniciada com Sucesso !");
});

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor iniciado na porta ${process.env.PORT} "http://localhost:${process.env.PORT}"`
  );
});
