import mongoose from "mongoose";

// Definir el esquema de favoritos
const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event", 
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    }
});

// Índice compuesto para evitar duplicados
favoriteSchema.index({ user: 1, event: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
