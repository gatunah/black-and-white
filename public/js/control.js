$(document).ready(() => {
  $("#form-url").on("submit", function (event) {
    event.preventDefault();
    dataForm();
  });

  function dataForm() {
    const urlImagen = $("#txt-subir-imagen").val();
    if (urlImagen == "") {
      $("#message").text("Debes ingresar una URL.");
    } else if (!regExpUrl(urlImagen)) {
      $("#message").text("Debes ingresar una URL válida.");
    } else {
      axios
        .post("/postdatos", urlImagen)
        .then(function (res) {
          if (res.data.success) {
            window.location.href = "/image-jimp";
          } else {
            $("#message").text("Error al procesar la imagen.");
          }
        })
        .catch(function (err) {
          console.error("Error:", err);
          $("#message").text("Error al procesar la imagen.");
        });
    }
  }
  function regExpUrl(paramUrl) {
    const imageUrlPattern = /\.(jpg|jpeg|png|gif)$/i;
    return imageUrlPattern.test(paramUrl);
  }  
});
