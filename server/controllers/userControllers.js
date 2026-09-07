const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    userModel.createUser(
      {
        full_name,
        email,
        password: hashedPassword,
        role,
      },
      (err) => {
        if (err) {
          console.error("Registration Error:", err);
          return res.status(500).json({ message: "Registration Failed" });
        }

        res.status(201).json({ message: "Registration Successful" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= LOGIN =================

const loginUser = async (req, res) => {
  console.log("LOGIN API HIT");

  const { email, password, role } = req.body;

  console.log(req.body);

  userModel.findUserByEmail(email, async (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Server Error" });
    }

    console.log("DB Result:", result);

    if (result.length === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const user = result[0];

    if (user.role !== role) {
      return res.status(401).json({ message: "Incorrect Role Selected" });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      console.log("Password Match:", isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Password" });
      }

      const token = jwt.sign(
        {
          id: user.user_id,
          role: user.role,
        },
        process.env.JWT_SECRET || "secretkey",
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        message: "Login Successful",
        token,
        user_id: user.user_id,
        name: user.full_name,
        role: user.role,
      });
    } catch (error) {
      console.error("Password Compare Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
};