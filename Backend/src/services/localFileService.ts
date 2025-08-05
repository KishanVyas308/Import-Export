import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export interface FileInfo {
  id: string;
  name: string;
  originalName: string;
  size: number;
  url: string;
  filePath: string;
  uploadedAt: Date;
}

export class LocalFileService {
  private static instance: LocalFileService;
  private uploadsDir: string;

  private constructor() {
    // Configure uploads directory based on environment
    if (process.env.NODE_ENV === 'production') {
      // In production, store files outside the project directory
      // This could be a shared volume, separate disk, or cloud storage mount
      const prodUploadPath = process.env.UPLOAD_DIR || path.join('..', '..', 'uploads');
      this.uploadsDir = path.resolve(prodUploadPath);
    } else {
      // In development, store files in the project's uploads folder
      this.uploadsDir = path.join(process.cwd(), 'uploads');
    }
    
    console.log(`Upload directory configured: ${this.uploadsDir}`);
    this.ensureUploadsDirectory();
  }

  static getInstance(): LocalFileService {
    if (!LocalFileService.instance) {
      LocalFileService.instance = new LocalFileService();
    }
    return LocalFileService.instance;
  }

  private ensureUploadsDirectory(): void {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
        console.log(`✅ Created uploads directory: ${this.uploadsDir}`);
      } else {
        console.log(`✅ Uploads directory exists: ${this.uploadsDir}`);
      }
      
      // Test write permissions
      const testFile = path.join(this.uploadsDir, '.test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`✅ Write permissions verified for: ${this.uploadsDir}`);
    } catch (error) {
      console.error(`❌ Failed to setup uploads directory: ${this.uploadsDir}`, error);
      throw new Error(`Upload directory setup failed: ${error}`);
    }
  }

  async uploadFile(buffer: Buffer, fileName: string, originalName: string, mimeType: string): Promise<FileInfo> {
    const filePath = path.join(this.uploadsDir, fileName);
    
    await writeFile(filePath, buffer);
    
    const stats = await stat(filePath);
    
    return {
      id: fileName,
      name: fileName,
      originalName,
      size: stats.size,
      url: `/api/uploads/${fileName}`,
      filePath,
      uploadedAt: new Date()
    };
  }

  async uploadPDF(buffer: Buffer, fileName: string, originalName: string): Promise<FileInfo> {
    return this.uploadFile(buffer, fileName, originalName, 'application/pdf');
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.uploadsDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      await unlink(fullPath);
    }
  }

  async getFileInfo(fileName: string): Promise<FileInfo | null> {
    const filePath = path.join(this.uploadsDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = await stat(filePath);
    
    return {
      id: fileName,
      name: fileName,
      originalName: fileName,
      size: stats.size,
      url: `/api/uploads/${fileName}`,
      filePath,
      uploadedAt: stats.birthtime
    };
  }

  async listFiles(): Promise<FileInfo[]> {
    const files = await readdir(this.uploadsDir);
    const fileInfos: FileInfo[] = [];
    
    for (const file of files) {
      const fileInfo = await this.getFileInfo(file);
      if (fileInfo) {
        fileInfos.push(fileInfo);
      }
    }
    
    return fileInfos;
  }

  getFileUrl(fileName: string): string {
    return `/api/uploads/${fileName}`;
  }
}
