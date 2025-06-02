import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {type: Boolean, default: false},
  about_me: {type: String, default: "Hi there, I'm a new user!"},
  avatar: {
    public_id: String,
    url: {
      type: String, 
      default: "https://www.gravatar.com/avatar/0?s=200&d=identicon"
    }
  },
  isActive: { type: Boolean, default: true },
});

// Middleware de Mongoose: Encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Exportar el modelo de usuario
export default mongoose.model("User", userSchema);
