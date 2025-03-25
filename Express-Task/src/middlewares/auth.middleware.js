import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Token required" });

    try {
        const decoded = jwt.verify(token, "SECRET_KEY"); // Key này phải giống với bên Auth Service
        req.userId = decoded.userId; // Lưu userId để sử dụng trong request
        next();  
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default verifyToken;
