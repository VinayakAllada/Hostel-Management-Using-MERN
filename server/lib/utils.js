// import jwt from "jsonwebtoken";

// // Generate token for both Student and Admin
// export const generateToken = (id, role) => {
//     return jwt.sign(
//         { id, role },
//         process.env.JWT_SECRET,
//         { expiresIn: "30d" }  
//     );
// };

// lib/utils.js
import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

