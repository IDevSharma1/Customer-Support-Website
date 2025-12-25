const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open',
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        required: true
    },
    category: {
        type: String,
        enum: ['project', 'technical', 'general'],
        default: 'general',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    comments: [commentSchema]
},
{ timestamps: true}
);

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
