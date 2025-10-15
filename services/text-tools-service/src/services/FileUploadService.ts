export class FileUploadService {
  static async processUpload(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    // Validate file type
    const allowedTypes = ['text/plain', 'text/csv', 'application/csv'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    // Read file content
    const content = file.buffer.toString('utf-8');
    
    if (content.length > 10000000) { // 10MB limit
      throw new Error('File is too large (max 10MB)');
    }
    
    return {
      success: true,
      data: {
        filename: file.originalname,
        size: file.buffer.length,
        mimetype: file.mimetype,
        content
      },
      timestamp: new Date().toISOString()
    };
  }
}
