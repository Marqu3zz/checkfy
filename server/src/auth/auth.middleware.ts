import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split('user=')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        req.user = jwt.verify(token, 'secret') as JwtPayload;

        return next();
    } catch (err) {
        return res.status(403).json({message: "token invalid or expired"});
    }
}
