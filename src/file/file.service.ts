import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FileService {
  async createFile(file, allowedExtensions: string[]): Promise<string> {
    try {
      const fileExtension = path.extname(file.originalname);
      if (!allowedExtensions.includes(fileExtension)) {
        throw new HttpException(
          'Недопустимое разрешение файла',
          HttpStatus.BAD_REQUEST,
        );
      }
      const fileName = uuid.v4() + fileExtension;
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
