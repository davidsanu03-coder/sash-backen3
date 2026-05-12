import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authentication failed" });

    const decodedData: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decodedData?.userId;
    req.userRole = decodedData?.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
