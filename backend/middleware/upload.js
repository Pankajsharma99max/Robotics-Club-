import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/temp';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images, PDFs, and videos are allowed'));
    }
};

// Multer upload configuration
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB default
    },
    fileFilter: fileFilter
});

// Image optimization middleware
export const optimizeImage = async (req, res, next) => {
    if (!req.file && !req.files) {
        return next();
    }

    try {
        const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file];

        for (const file of files) {
            // Only optimize images
            if (file.mimetype.startsWith('image/')) {
                const optimizedPath = file.path.replace('/temp/', '/');
                const dir = path.dirname(optimizedPath);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                await sharp(file.path)
                    .resize(1920, 1080, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: 85 })
                    .toFile(optimizedPath);

                // Delete temp file
                fs.unlinkSync(file.path);

                // Update file path
                file.path = optimizedPath;
                file.filename = path.basename(optimizedPath);
            } else {
                // Move non-image files to final destination
                const finalPath = file.path.replace('/temp/', '/');
                const dir = path.dirname(finalPath);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                fs.renameSync(file.path, finalPath);
                file.path = finalPath;
                file.filename = path.basename(finalPath);
            }
        }

        next();
    } catch (error) {
        console.error('Image optimization error:', error);
        next(error);
    }
};
