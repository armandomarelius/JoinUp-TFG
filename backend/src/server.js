import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Iniciar el servidor escuchando en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(` JoinUp Backend iniciado en puerto ${PORT}`);
});