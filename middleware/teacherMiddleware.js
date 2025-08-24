const teacherMiddleware = (req, res, next) => {
  try {
    // Check if user exists and has teacher role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    next();
  } catch (error) {
    console.error('Teacher middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization'
    });
  }
};

module.exports = teacherMiddleware;
