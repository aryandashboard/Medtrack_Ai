const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // We prefer secure HTTP-only cookies, but also fallback to Bearer token
  let token = req.cookies.token;
  
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (ex) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = { verifyToken };
