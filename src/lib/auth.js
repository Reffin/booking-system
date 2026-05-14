import jwt from "jsonwebtoken";

export function verifyToken(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export function isAdmin(request) {
  const user = verifyToken(request);
  return user?.role === "admin";
}