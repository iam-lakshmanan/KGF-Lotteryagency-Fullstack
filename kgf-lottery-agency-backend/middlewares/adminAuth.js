// import jwt from "jsonwebtoken";

// const adminAuth = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Admin token missing",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

//     req.admin = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired admin token",
//     });
//   }
// };

// export default adminAuth;


import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    // 🔴 Always read header safely
    const authHeader =
      req.headers["authorization"] ||
      req.headers["Authorization"];

      console.log('authHeader', authHeader)

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Admin token missing"
      });
    }

    // 🔴 Must handle "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token format"
      });
    }

    const token = parts[1];

    console.log('token', token)

    // 🔴 Verify using ADMIN_JWT_SECRET ONLY
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET
    );
    console.log

    // Optional role check
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not an admin token"
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token"
    });
  }
};

export default adminAuth;