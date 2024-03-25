// bucket.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bucket } from '../entity/bucket.entity';
import { File } from 'src/modules/files/entities/file.entity';
import * as path from 'path';
import * as fs from 'fs';


@Injectable()
export class BucketService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Bucket)
    private readonly bucketRepository: Repository<Bucket>,
  ) {}

   async createBucket(user: any,name:string) {
    try{
      
    const bucket = new Bucket();
    bucket.name = name;
    bucket.user = user.sub; 
    await this.bucketRepository.save(bucket);
    return {
      status: 201,
      message: 'bucket created successfully',
      data: bucket,
    };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}

  async getAllBuckets(user:any){
    try{
     const buckets=await this.bucketRepository.find({ where: { user: { id: user.sub } } });
    return {
      status: 200,
      message: 'bucket list retrived successfully',
      data: buckets,
    };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
  }
  async getBucketById(bucketId: number, user: any) {
    try {
      const files = await this.fileRepository.find({
        where: { bucket: { id: bucketId, user: { id: user.sub } } },
      });
      
      if (!files || files.length === 0) {
        throw new NotFoundException('No files found for this bucket');
      }

      const fileLinks = files.map(file => ({
        filename: file.filename,
        contentType: file.contentType,
        url: `http://localhost:3000/object/download/${file.id}`,
      }));

      return {
        status: 200,
        message: 'Files retrieved successfully',
        data: fileLinks,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }



  async updateBucketName(bucketId: number, newName: string,user:any){
    try{
    const bucket=await this.bucketRepository.findOne({ where: { user: { id: user.sub } ,id:bucketId} });
      if (!bucket) {
        throw new NotFoundException('bucket not found for this bucketId');
      }
      bucket.name=newName;
      await this.bucketRepository.save(bucket);
       return {
         status: 200,
         message: 'bucket details updated successfully',
         data: bucket,
       };
     } catch (error) {
       throw new InternalServerErrorException(error.message);
     }
    }
 

  async deleteBucket(bucketId: number,user:any){
    try{
      const bucket=await this.bucketRepository.findOne({ where: { user: { id: user.sub } ,id:bucketId} });
      if (!bucket) {
        throw new NotFoundException('bucket not found for this id');
      }
      await this.bucketRepository.delete(bucketId)
       return {
         status: 200,
         message: 'bucket deleted successfully',
         data: bucket,
       };
     } catch (error) {
       throw new InternalServerErrorException(error.message);
     }
  }

  
}
