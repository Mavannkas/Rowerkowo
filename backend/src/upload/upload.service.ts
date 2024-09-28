import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/auth.types';
import { FileEntity } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(FileEntity.name) private fileModel: Model<FileEntity>,
  ) {}

  async upload(
    user: JwtPayload,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const filePromises = files.map(async (file) => {
      const newFile = new this.fileModel({
        name: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        owner: user.sub,
        path: file.path,
        originalname: file.originalname,
        filename: file.filename,
      });

      const { id } = await newFile.save();

      return id;
    });

    try {
      const ids = await Promise.all(filePromises);
      return ids;
    } catch (error) {
      console.error('Error saving files:', error);
      throw new InternalServerErrorException('Failed to upload files');
    }
  }
}
