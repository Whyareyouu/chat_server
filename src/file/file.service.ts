import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';
import * as mime from 'mime';

@Injectable()
export class FileService {
  async createFile(file): Promise<string> {
    try {
      const fileExtension = mime.getExtension(file.mimeType);
      const fileName = v4() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'client');
      if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath, { recursive: true }, () => {});
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
