# Secure Express.js File Upload Application

This project demonstrates how to implement secure file upload functionality in an **Express.js** application using **Multer**. The application includes features to validate file types, limit file sizes, and securely store uploaded files.

---

## Features

- **Secure File Upload**: Handles file uploads with strict validation to prevent malicious uploads (e.g., polyglot files).
- **File Type Validation**: Only allows specific file types (e.g., JPEG, PNG, GIF).
- **Content-Based Validation**: Uses the `file-type` library to ensure the actual file content matches the expected type, enhancing security.
- **Size Limitation**: Enforces maximum file size to prevent abuse.
- **Unique Filenames**: Uses UUIDs to generate unique filenames, preventing overwriting or predictable filenames.
- **Secure Storage**: Files are stored securely outside the public directory, served through controlled routes.
- **Error Handling**: Provides clear error messages for invalid or rejected uploads.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

---

## Installation

1. Clone the repository:
   Follow the instructions in the [main README](https://github.com/Tharbouch/Toward-Secure-Code/blob/main/README.md) to set up this project.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   node server.js
   ```

The application will run on `http://localhost:3000`.

---

## Routes

### `/upload-avatar`

**POST** endpoint to upload a file. The uploaded file is validated, stored securely, and associated with a unique filename.

#### Request Example:

**Headers:**
- `Content-Type: multipart/form-data`

**Body:**
- `avatar`: File to upload.

#### Response Example:

- **Success:**
  ```json
  {
      "message": "File uploaded successfully!",
      "filename": "a1b2c3d4-5678-9101-abcd-1234567890ef.jpg"
  }
  ```

- **Error:**
  ```json
  {
      "error": "Invalid file type. Only JPEG, PNG, and GIF files are allowed."
  }
  ```

---

## Key Files

### `server.js`

Main application file:
- Configures the Express server.
- Sets up routes and middleware.
- Handles file uploads and errors.
- Implements content-based file validation using the `file-type` library.
- Strips all file's metadata using`sharp` library.

### `config/multerConfig.js`

Handles file storage configuration using **Multer**:
- Checks if the upload directory exists and creates it if necessary.
- Generates unique filenames.
- Validates file types and MIME types to prevent malicious uploads.
- Defines file size limits (e.g., 2 MB).

### `middleware/errHandler.js`

Custom middleware for handling errors:
- Provides detailed error messages for Multer-specific and general errors.
- Differentiates between file size limits, invalid file types, and other issues.

### `views/home.ejs`

Contains a simple form with file upload input to test the functionality.

---

## Security Features

### 1. File Type Validation
Ensures only valid file types are accepted by comparing MIME types and file extensions.

### 2. Content-Based Validation
Uses the `file-type` library to analyze the actual file content, preventing spoofed file uploads.

### 3. Unique Filenames
Prevents filename collisions by using UUIDs to generate unique names.

### 4. Remove MetaData
Strips all metadata from uploaded images to prevent the leakage of sensitive information and mitigate advanced attack vectors.

### 5. File Size Limits
Limits the maximum file size to 2 MB, preventing large file uploads.

### 6. Secure Storage
Stores files outside the public directory, preventing direct access and ensuring controlled delivery.

### 7. Error Handling
Rejects invalid uploads with clear error messages for users and logs errors for debugging.

---

## How to Customize

### Modify Allowed File Types
To allow additional file types, update the `fileFilter` function in `config/multerConfig.js`:

```javascript
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
```

Add MIME types as needed.

### Change File Size Limit
Update the `limits` object in `config/multerConfig.js`:

```javascript
const limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB
```

### Change Upload Directory
Modify the `storage` configuration in `config/multerConfig.js`:

```javascript
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'new_uploads_directory'),
    // ...
});
```

Ensure the new directory exists and is writable.

---

## Example Use Case

1. User navigates to the homepage and uploads an avatar image.
2. The file is validated on the server (extension, MIME type, content, and size).
3. If valid, the file is saved securely in the `uploads/avatars` directory.
4. A success message is returned with the unique filename.
5. If invalid, the user receives a detailed error message explaining the issue.

---

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).

