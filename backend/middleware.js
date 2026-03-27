import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ error: 'Not Authorised' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.json({ error: 'Not Authorised' });
        }
    } catch (err) {
        return res.json({ error: 'Not Authorised' });
    }
};

export default authMiddleware