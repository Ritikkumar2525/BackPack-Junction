import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;
