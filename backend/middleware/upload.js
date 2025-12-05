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
                // Construct optimized path: move from uploads/temp/ to uploads/
                const filename = path.basename(file.path);
                // Go up one directory from the temp folder
                const uploadDir = path.dirname(path.dirname(file.path));
                const optimizedPath = path.join(uploadDir, filename);

                const dir = path.dirname(optimizedPath);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Ensure we are not overwriting the source file
                if (path.resolve(file.path) === path.resolve(optimizedPath)) {
                    // This should not happen if temp dir is used, but as a fallback:
                    throw new Error('Input and output paths are the same. Check storage configuration.');
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

                // Update file path to be relative for the database (e.g., uploads/filename.jpg)
                // We want forward slashes for URLs
                const relativePath = path.relative(process.cwd(), optimizedPath).split(path.sep).join('/');

                // If the path doesn't start with the upload directory name, prepend it (safety check)
                // But path.relative from cwd should give 'uploads/filename.jpg'

                file.path = optimizedPath; // Keep absolute/system path for file operations if needed later
                file.filename = filename;
                // We might need to attach the URL-friendly path for the controller to use
                // The controller uses `req.file.filename` to construct `/uploads/${req.file.filename}`
                // So we just need to make sure the file is actually there.
            } else {
                // Move non-image files to final destination
                const filename = path.basename(file.path);
                const uploadDir = path.dirname(path.dirname(file.path));
                const finalPath = path.join(uploadDir, filename);
                const dir = path.dirname(finalPath);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                fs.renameSync(file.path, finalPath);
                file.path = finalPath;
                file.filename = filename;
            }
        }

        next();
    } catch (error) {
        console.error('Image optimization error:', error);
        next(error);
    }
};
