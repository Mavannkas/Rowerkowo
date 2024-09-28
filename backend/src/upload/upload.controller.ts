import {
  Request,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesUnlinkFilter } from './files-unlink.filter';
import { getUnExistingFileName } from 'src/utils/files.util';
import { Request as ExpressRequest } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: async (req, file, cb) => {
          console.log(file);
          const name = await getUnExistingFileName(
            './uploads',
            file.originalname,
          );
          cb(null, name);
        },
      }),
    }),
  )
  @UseFilters(new FilesUnlinkFilter('files'))
  create(
    @Request() req: ExpressRequest,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .addFileTypeValidator({
          fileType: 'image/*',
        })
        .build(),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.uploadService.upload(req.userPayload, files);
  }
}
