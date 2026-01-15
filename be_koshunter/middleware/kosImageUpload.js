const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'kos_images'))
    },
    filename: (request, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`)
    }
});

const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (request, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extName) {
            cb(null, true)
        }else{
            cb(new Error('Only image are allowed'))
        }
    }
});

module.exports = uploadFile