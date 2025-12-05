import imageCompression from 'browser-image-compression';

/**
 * Compress image on client side before upload
 * @param {File} file - Image file to compress
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImageClient = async (file) => {
    const options = {
        maxSizeMB: 0.2, // 200KB
        maxWidthOrHeight: 400,
        useWebWorker: true,
        fileType: 'image/webp'
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Image compression error:', error);
        throw new Error('Failed to compress image');
    }
};

/**
 * Create preview URL from file
 * @param {File} file - Image file
 * @returns {string} - Object URL for preview
 */
export const createPreviewURL = (file) => {
    return URL.createObjectURL(file);
};

/**
 * Revoke preview URL to free memory
 * @param {string} url - Object URL to revoke
 */
export const revokePreviewURL = (url) => {
    URL.revokeObjectURL(url);
};
