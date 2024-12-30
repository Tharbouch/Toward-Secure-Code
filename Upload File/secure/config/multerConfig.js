import path from 'path';
import multer from 'multer';


// Define allowed MIME types and extensions
export const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; 
const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif'];

// Define filter strategy
const fileFilter = async (_, file, cb) => {
    try {
      
        // Check MIME type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid MIME type!'), false);
        }

        // Check file extension
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('Invalid file extension!'), false);
        }
        return cb(null, true);

    } catch (error) {
        return cb(new Error('Could not process file type!'), false);
    }
};

// Define storage strategy using memory storage
const storage = multer.memoryStorage();

// Define maximum file size (2 MB)
const limits = {
    fileSize: 2 * 1024 * 1024 // 2 MB
};

// Initialize Multer with the defined configurations
export const multerInstance = multer({
    storage: storage,
    fileFilter:fileFilter,
    limits: limits
});
