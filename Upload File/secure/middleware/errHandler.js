import multer from 'multer';

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).send('File too large. Maximum size is 2MB.');
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).send(err.message);
        }
        return res.status(400).send('An error occurred during file upload.');
    } else if (err) {
        // Log the complete error for debugging
        console.error('Detailed Error:', err);
        
        const errorMessages = {
            'Invalid file extension!': 'Invalid file type',
            'Invalid MIME type!': 'Invalid file type',
            'File type not allowed!': 'Invalid file type',
            'Could not process file type!': 'Server error: Unable to process file.',
        };

        // Check if the error message exists in the mapping
        if (errorMessages[err.message]) {
            return res.status(400).send(errorMessages[err.message]);
        }

        // Handle other unknown errors
        return res.status(500).send('An unexpected error occurred.');
    }
    next();
}

export default errHandler;
