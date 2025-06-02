import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    request_date: {type: Date, default: Date.now}
});

const EventRequest = mongoose.model("EventRequest", requestSchema);

export default EventRequest;

