import mongoose from "mongoose";

// Definir el esquema del evento
const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    coordinates: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    date: {type: Date, required: true},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}],
    category: {
        type:String, 
        enum: ["tapeo", "senderismo", "deporte", "fiesta", "musica", "viajes", "cultura", "idiomas", "other"], 
        required: true},  
    participation_type: {
        type: String,
        enum: ["participative", "informative"],
        default: "participative"
    },
    image: {
        public_id: String,
        url: String
    },
    creation_date: {type: Date, default: Date.now},
    status: {
        type: String,
        enum: ["open", "close", "finished"],
        default: "open",
      },
    max_participants: { type: Number, default: null } 
});

const Event = mongoose.model("Event", eventSchema);

export default Event;

