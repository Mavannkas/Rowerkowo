import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { Request, Response } from 'express';
function isMulterFiles(files: any): files is Express.Multer.File[] {
  return files?.every((file) => file.fieldname && file.originalname);
}

@Catch()
export class FilesUnlinkFilter implements ExceptionFilter {
  constructor(private readonly paramName: string) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & Record<string, unknown>>();

    if (isMulterFiles(request.files)) {
      for (const file of request.files) {
        unlink(file.path);
      }
    }

    response.status(exception.getStatus()).json(exception.getResponse());
  }
}
