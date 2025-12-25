const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res, next) => {
    try {
        const { title, description, priority, category } = req.body;

        if(!title || !description) {
            return res.status(400).json({ message: `Title and description are required`});
        }

        const ticket = await Ticket.create({
            title,
            description,
            priority,
            category,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyTickets = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const tickets = await Ticket.find({
            $or: [{ createdBy: userId }, { assignedTo: userId }],
        }).sort({ createdAt: -1 });

        res.json({ tickets });
    } catch (err) {
        next(err);
    }
};

exports.getMyTicketById = async (req, res, next) => {
    try {
        const ticket = await Ticket.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .populate("comments.author", "name email role");

        if(!ticket) {
            return res.status(404).json({ message: 'Ticket not found'});
        }

        // Ensure each comment has a valid createdAt; fill from ObjectId timestamp if missing
        let modified = false;
        ticket.comments.forEach((c) => {
            if (!c.createdAt || isNaN(new Date(c.createdAt).getTime())) {
                // Use ObjectId timestamp as best-effort creation time
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
    } catch (error) {
        next(error);
    }
};
