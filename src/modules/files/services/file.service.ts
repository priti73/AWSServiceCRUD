// file.service.ts
import { Injectable, InternalServerErrorException, NotFoundException,HttpStatus, ForbiddenException, } from '@nestjs/common';
import { Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { fileDto } from '../dto/createFile.dto';
import { Bucket } from 'src/modules/buckets/entity/bucket.entity';
import * as path from 'path';
import * as fs from 'fs';


@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Bucket)
    private readonly bucketRepository: Repository<Bucket>,
  
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}
    async createObject(file: Express.Multer.File, bucketId: number, filedto: fileDto,user:any) {
      try{
        const bucket=await this.bucketRepository.findOne({ where: { user: { id: user.sub } ,id:bucketId} });
      if (!bucket) {
        throw new NotFoundException('bucket not found with this bucketId for you');
      }
      const { originalname, path ,mimetype} = file;
      const newFile = await this.fileRepository.create({
        filename: originalname,
        path: path,
        contentType: mimetype,
        bucket: bucket,
      });
      await this.fileRepository.save(newFile);
      return {
        status: 201,
        message :'file uploaded successfully',
        data: newFile,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    }

    async getFileById(objectId: number, res: any,user:any) {
      try {
        const file = await this.fileRepository.findOne({ where: { id: objectId }, relations: ['bucket'] });
        if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.bucket.user !== user.sub) {
      throw new ForbiddenException('This file does not belong to you');
    }
        const filePath = path.join(__dirname, '..', '..', '..', '..', file.path);
  
        if (!fs.existsSync(filePath)) {
          throw new NotFoundException('File not found');
        }
  
        const fileStream = fs.createReadStream(filePath);
  
        fileStream.on('error', (error) => {
          console.error('Error reading file:', error);
          res.status(500).send('Internal Server Error');
        });
  
        fileStream.on('open', () => {
          res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
          res.setHeader('Content-Type', file.contentType);
        });
  
        fileStream.on('end', () => {
          console.log('File download successful');
        });
  
        fileStream.pipe(res);
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }

    async deleteObject(objectId: number,user:any) {
      try {
        const file = await this.fileRepository.findOne({ where: { id: objectId }, relations: ['bucket'] });
        if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.bucket.user !== user.sub) {
      throw new ForbiddenException('This file does not belong to you');
    }
    await this.fileRepository.remove(file);
        return {
          status: 200,
          message: 'File deleted successfully',
        };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }

    async downloadFile(objectId: number, res: any) {
      try {
        const file = await this.fileRepository.findOne({where:{id:objectId}});
        
        if (!file) {
          throw new NotFoundException('File not found');
        }
  
        const filePath = path.join(__dirname, '..', '..', '..', '..', file.path);
        if (!fs.existsSync(filePath)) {
          throw new NotFoundException('File not found');
        }
  
        const fileContent = fs.readFileSync(filePath);
  
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.setHeader('Content-Type', file.contentType);
  
        res.send(fileContent);
      } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  }
  