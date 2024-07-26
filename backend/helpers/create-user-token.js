const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        id: user._id,
        name: user.name,
    }, "secret");

    res.status(200).json({
        message: "you're authenticated",
        token: token,
        userId: user._id
    });
}

module.exports = createUserToken;