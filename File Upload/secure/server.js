import express from 'express';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import {multerInstance,allowedMimeTypes,preventPathTraversal} from './config/multerConfig.js';
import errHandler from './middleware/errHandler.js';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

//Setup ejs template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use Helmet to secure HTTP headers
app.use(helmet());

// Serve static files from 'public' directory
// app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Ensure the upload directory exists
const uploadDirectory = path.join(__dirname, 'uploads', 'avatars');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true,mode: 0o755 });
}


// This endpoint renders the 'home.ejs' template, which includes a user-friendly interface for uploading files (e.g., avatar images).
app.get('/', (_, res) => {
    res.render('home');
});

// You can implement authentication routes and other endpoints for your application.


// Route to handle avatar upload
app.post('/upload-avatar', multerInstance.single('avatar'), async(req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded or invalid file type.');
    }

    // Validate the actual file type using buffer
    const type = await fileTypeFromBuffer(req.file.buffer);
    if (!type || !allowedMimeTypes.includes(type.mime)) {
        console.log(`Detected file type: ${type.mime}`);
        console.log('File type not allowed based on buffer analysis.');
        return res.status(400).send('Invalid file type.');
    }

    console.log(`Detected file type: ${type.mime}`);

    // Generate a unique filename
    const uniqueName = `${uuidv4()}${path.extname(req.file.originalname).toLowerCase()}`;

    // Define the final path
    const finalPath = path.join(uploadDirectory, uniqueName);

    // Checking Path Travesal, even Multer's built-in protection is good because we used memoryStorage()
    if (!preventPathTraversal(finalPath, uploadDirectory)) {
        const error = new Error('Potential path traversal attack detected');
        error.statusCode = 400;
        return next(error)
    }

    // removes metadata
    const processedBuffer = await sharp(req.file.buffer).withMetadata(false) .toBuffer();

    // Save the file to disk
    fs.writeFile(finalPath, processedBuffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return next(err); // Pass error to error handler
        }

        // At this point, the file has been successfully processed by Multer and stored.
        // Optional: Save metadata (e.g., filename) in the user's record in the database
        // This allows you to associate the uploaded avatar with a user and retrieve it later.

        res.send(`File uploaded successfully! Filename: ${uniqueName}`);
    });
});


// error middleware
app.use(errHandler)

app.listen(3000,()=>{
    console.log("Happy secure coding");
})