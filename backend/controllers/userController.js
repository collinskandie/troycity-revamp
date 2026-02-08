// controllers/userController.js
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.createUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Check if user exists
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            role: role || "admin"
        });

        res.status(201).json({
            message: "User created",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Create user error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Missing credentials");
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        const match = await bcrypt.compare(password, user.passwordHash);

        if (!match) {
            return res.status(401).send("Invalid email or password");
        }

        // ✅ Create session
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        res.redirect("/admin");

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Server error");
    }
};
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Could not log out");
        }

        res.clearCookie("admin.sid");
        res.redirect("/login");
    });
};
exports.requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

