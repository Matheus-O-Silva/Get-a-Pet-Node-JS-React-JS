const multer = require("multer");
const path = require("path");

// Destination to store imagess
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes('users')) {
        folder = "users";
    } else if (req.baseUrl.includes('pets')) {
        folder = "pets";
    }

        cb(null, `public/images/${folder}/`);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + String(Math.floor(Math.random() * 100)) +
        path.extname(file.originalname));
    },
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
        // upload only png and jpg format
        return cb(new Error("only png or jpg files are supported"));
    }
    cb(undefined, true);
    },
});

module.exports = { imageUpload };