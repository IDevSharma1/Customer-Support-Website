const Ticket = require("../models/Ticket");

exports.getAllTickets = async (req, res, next) => {
  try {
    const { status, priority, category } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (err) {
    next(err);
  }
};

exports.assignTicket = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res
        .status(400)
        .json({ message: "assignedTo user id is required" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    )
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      message: "Ticket assigned successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      message: "Ticket status updated successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

exports.addAdminComment = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Comment message is required" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.comments.push({
      author: req.user.id,
      message,
    });

    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("comments.author", "name email role");

    res.status(201).json({
      message: "Comment added successfully",
      ticket: populatedTicket,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: fetch a ticket by id (can view any ticket)
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("comments.author", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Ensure each comment has a valid createdAt; fill from ObjectId timestamp if missing
    let modified = false;
    ticket.comments.forEach((c) => {
      if (!c.createdAt || isNaN(new Date(c.createdAt).getTime())) {
        if (c._id && typeof c._id.getTimestamp === 'function') {
          c.createdAt = c._id.getTimestamp();
        } else {
          c.createdAt = new Date();
        }
        modified = true;
      }
    });

    if (modified) {
      await ticket.save();
    }

    res.json({ ticket });
  } catch (err) {
    next(err);
  }
};
