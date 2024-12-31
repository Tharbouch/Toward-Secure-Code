import path from 'path';
import multer from 'multer';


// Define allowed MIME types and extensions
export const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; 
const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif'];

// Define filter strategy
const fileFilter = (_, file, cb) => {
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

// Function to decode various encodings
// Keep decoding until the string doesn't change anymore
function formatDecoding(pathEncoding){

    let decodedPath = pathEncoding;

    let lastDecodedPath;
    do {

        lastDecodedPath = decodedPath;

        try {
            // URL decoding
            decodedPath = decodeURIComponent(decodedPath);
            
            // Unicode decoding
            decodedPath = decodedPath.replace(/\u2215/g, '/');
            
            // UTF-8 decoding
            decodedPath = decodedPath.replace(/%C0%AF/gi, '/');
            
            // Replace backslashes with forward slashes for consistency
            decodedPath = decodedPath.replace(/\\/g, '/');
            
            // Replace multiple slashes with a single slash
            decodedPath = decodedPath.replace(/\/+/g, '/');
            
            // Handle Unicode/UTF-16 null bytes
            decodedPath = decodedPath.replace(/\u0000/g, '');
            
            // Handle hex-encoded null bytes
            decodedPath = decodedPath.replace(/%00/g, '');
            
        } catch (e) {
            console.log("Decoding Error: "+e)
            // If decoding fails, return null to indicate invalid input
            return null;
        }
        
    } while (decodedPath != lastDecodedPath);
}

export function preventPathTraversal(filePath,uploadDirectory){

    const decodedPath = formatDecoding(filePath);

    //  If error arised and null returned
    if (!decodedPath) { 
        return false;
    }
    try{

    // Normalize paths (resolves . and .. segments)
        const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, '');
        const normalizedRoot = path.normalize(uploadDirectory);
        
        // Convert to absolute paths
        const absolutePath = path.resolve(normalizedPath);
        const absoluteRoot = path.resolve(normalizedRoot);
        
        // Check if the final path starts with the root directory
        return absolutePath.startsWith(absoluteRoot) && 
               !path.basename(decodedPath).includes('\0') && // Check for null bytes
               !path.basename(decodedPath).includes('%00');  // Check for encoded null bytes
               
    } catch (e) {
        console.log("path checking error: "+e);

        // If error returning false as unvalid path
        return false;
    }
}

