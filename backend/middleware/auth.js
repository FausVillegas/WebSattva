import pkg from 'jsonwebtoken';
const { verify } = pkg;

export function isAuthenticated(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = verify(token, process.env.SECRETFORTOKEN);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    req.role = decodedToken.role;
    next();
}

export function isAdmin(req, res, next) {
    if (req.role !== 'admin') {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        return next(error);
    }
    next();
}
