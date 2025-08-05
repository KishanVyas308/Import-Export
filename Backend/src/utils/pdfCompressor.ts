import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

export interface CompressionResult {
  success: boolean;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  error?: string;
}

export async function checkGhostscriptAvailability(): Promise<boolean> {
  try {
    await execAsync('gs --version');
    return true;
  } catch (error) {
    return false;
  }
}

export async function compressPDF(inputPath: string, outputPath: string): Promise<CompressionResult> {
  try {
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    // Use Ghostscript to compress PDF
    const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
    
    await execAsync(command);

    if (!fs.existsSync(outputPath)) {
      throw new Error('Compressed file was not created');
    }

    const compressedStats = fs.statSync(outputPath);
    const compressedSize = compressedStats.size;
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    return {
      success: true,
      originalSize,
      compressedSize,
      compressionRatio
    };
  } catch (error) {
    return {
      success: false,
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      error: error instanceof Error ? error.message : 'Unknown compression error'
    };
  }
}
