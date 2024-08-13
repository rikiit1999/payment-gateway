const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const predefinedAdmins = [
    { username: process.env.USERNAME_PRIVATE, password: process.env.PASSWORD_PRIVATE }
];

// Register a new user/ admin
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username is already taken
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username already taken' });

        // Check if the provided credentials match predefined admin credentials
        const isAdminCredential = predefinedAdmins.some(admin => 
            admin.username === username && admin.password === password
        );

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user object with isAdmin set based on the credentials
        user = new User({
            username,
            password: hashedPassword,
            isAdmin: isAdminCredential
        });

        await user.save();

        const payload = {
            user: { id: user.id }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Login a user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};