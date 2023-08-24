import { HttpException, HttpStatus } from '@nestjs/common';
import * as mime from 'mime-types';

export function AllowedFileExtensions(allowedExtensions: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const file = args[0];

      if (!file || !file.mimeType || !file.buffer) {
        throw new HttpException('Некорректный файл', HttpStatus.BAD_REQUEST);
      }

      const fileExtension = mime.getExtension(file.mimeType);

      if (!allowedExtensions.includes(fileExtension)) {
        throw new HttpException(
          'Недопустимое разрешение файла',
          HttpStatus.BAD_REQUEST,
        );
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
