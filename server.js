const express = require("express");
const axios = require("axios");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const app = express();
const Jimp = require("jimp");
const port = 3002;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const exphbs = require("express-handlebars");
const { url } = require("inspector");
const { error } = require("console");
app.engine(
  "handlebars",
  exphbs.engine({
    //defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.set("view engine", "handlebars");

//ESTATICOS
app.use(express.static("public"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/axios", express.static(__dirname + "/node_modules/axios/dist"));

// Middleware CONVIERTE EN OBJETOS JS ACCECIBLES POR req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("home", { layout: "main" });
});
app.post("/postdatos", async (req, res) => {
  try {
    const urlImagen = Object.keys(req.body)[0]; //HAY QUE ACCEDER AL OBJETO
    req.app.locals.urlImagen = urlImagen;
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
});

app.get("/image-jimp", async (req, res) => {
  try {
    //res.setHeader("Content-type", "image/png");//SE USA SOLO CUANDO SE ENVIA IMAGEN DIRECTAMENTE
    const urlImagen = req.app.locals.urlImagen;
    const uuid = uuidv4().slice(0, 6);
    const imageName = `${uuid}.jpg`;
    const imagePath = `public/img-user/${imageName}`;
    const imagen = await Jimp.read(urlImagen);
    await imagen.resize(350, Jimp.AUTO).grayscale().writeAsync(imagePath);
    req.app.locals.imagePath = imagePath;

    res.render("view-imagen", { layout: "main", imageName, msg: "Imagen" });
  } catch (error) {
    console.error(error);
    res.render("view-imagen", { layout: "main", msg: "Error al procesar" });
  }
});
app.get("/download/:imgName", (req, res) => {
  const imgName = req.params.imgName;
  const filePath = path.resolve(__dirname, "public", "img-user", imgName); // RUTA ABS
  console.log(filePath);

  res.type("image/jpeg");

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error al enviar el archivo:", err);
      res.status(err.status).end();
    } else {
      console.log("Archivo enviado correctamente");
    }
  });
});
