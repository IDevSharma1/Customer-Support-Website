const User = require('../models/User');

exports.getUsersForAdmin = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email role').sort({ name: 1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
