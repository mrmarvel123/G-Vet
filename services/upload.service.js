// File Upload Service
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const dirs = ['assets', 'livestock', 'documents', 'qrcodes'];
dirs.forEach(dir => {
    const fullPath = path.join(uploadDir, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'documents';
        
        if (file.fieldname === 'assetImage') folder = 'assets';
        if (file.fieldname === 'livestockImage') folder = 'livestock';
        
        cb(null, path.join(uploadDir, folder));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,application/pdf').split(',');
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
    }
});

// Generate QR Code
async function generateQRCode(data, filename) {
    try {
        const qrDir = path.join(uploadDir, 'qrcodes');
        const qrPath = path.join(qrDir, `${filename}.png`);
        
        await QRCode.toFile(qrPath, data, {
            width: parseInt(process.env.QR_CODE_SIZE) || 300,
            margin: parseInt(process.env.QR_CODE_MARGIN) || 2,
            errorCorrectionLevel: 'H'
        });
        
        return `/uploads/qrcodes/${filename}.png`;
    } catch (error) {
        throw new Error(`QR Code generation failed: ${error.message}`);
    }
}

// Generate QR Code as data URL
async function generateQRCodeDataURL(data) {
    try {
        return await QRCode.toDataURL(data, {
            width: parseInt(process.env.QR_CODE_SIZE) || 300,
            margin: parseInt(process.env.QR_CODE_MARGIN) || 2,
            errorCorrectionLevel: 'H'
        });
    } catch (error) {
        throw new Error(`QR Code generation failed: ${error.message}`);
    }
}

// Delete file
function deleteFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(`File deletion failed: ${error.message}`);
    }
}

module.exports = {
    upload,
    generateQRCode,
    generateQRCodeDataURL,
    deleteFile
};
