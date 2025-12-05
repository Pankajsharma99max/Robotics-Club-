import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

/**
 * Compress and resize image to optimize file size
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} filename - Original filename
 * @returns {Promise<{buffer: Buffer, filename: string}>} - Optimized image buffer and new filename
 */
export const compressImage = async (imageBuffer, filename) => {
    try {
        // Get file extension
        const ext = path.extname(filename).toLowerCase();
        const nameWithoutExt = path.basename(filename, ext);

        // Resize to 400x400 and compress
        const compressedBuffer = await sharp(imageBuffer)
            .resize(400, 400, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 }) // Convert to WebP for better compression
            .toBuffer();

        // If still too large, reduce quality further
        let finalBuffer = compressedBuffer;
        let quality = 80;

        while (finalBuffer.length > 200 * 1024 && quality > 20) {
            quality -= 10;
            finalBuffer = await sharp(imageBuffer)
                .resize(400, 400, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality })
                .toBuffer();
        }

        const newFilename = `${nameWithoutExt}-${Date.now()}.webp`;

        return {
            buffer: finalBuffer,
            filename: newFilename
        };
    } catch (error) {
        throw new Error(`Image compression failed: ${error.message}`);
    }
};

/**
 * Save compressed image to uploads directory
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Filename
 * @param {string} subfolder - Subfolder in uploads (e.g., 'profiles')
 * @returns {Promise<string>} - Relative path to saved image
 */
export const saveImage = async (buffer, filename, subfolder = 'profiles') => {
    try {
        const uploadDir = path.join(process.cwd(), 'uploads', subfolder);

        // Create directory if it doesn't exist
        await fs.mkdir(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);

        // Return relative path for database storage
        return `/uploads/${subfolder}/${filename}`;
    } catch (error) {
        throw new Error(`Failed to save image: ${error.message}`);
    }
};

/**
 * Delete image file
 * @param {string} imagePath - Relative path to image
 */
export const deleteImage = async (imagePath) => {
    try {
        if (!imagePath) return;

        const fullPath = path.join(process.cwd(), imagePath.replace(/^\//, ''));
        await fs.unlink(fullPath);
    } catch (error) {
        // Silently fail if file doesn't exist
        console.error('Failed to delete image:', error.message);
    }
};

/**
 * Validate image file
 * @param {Express.Multer.File} file - Uploaded file
 * @returns {boolean} - True if valid
 */
export const validateImage = (file) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB before compression

    if (!allowedMimes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 10MB.');
    }

    return true;
};
