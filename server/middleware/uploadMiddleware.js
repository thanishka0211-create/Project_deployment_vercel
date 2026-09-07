const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ========================================
// CREATE /upload FOLDER IF IT DOESN'T EXIST
// ========================================

const uploadFolder = path.join(__dirname, "../upload");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// ========================================
// MULTER STORAGE CONFIGURATION
// ========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {

        const fileName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

        cb(null, fileName);
    }

});

// ========================================
// ALLOW ONLY PDF FILES
// ========================================

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed."), false);
    }

};

// ========================================
// EXPORT MULTER
// ========================================

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB
    }
});

module.exports = upload;