// bucket.controller.ts
import { Controller, Post, Get, Param, Body, Put, Delete, Req, UseGuards, Patch, Res } from '@nestjs/common';
import { BucketService } from '../service/bucket.service';
import { Bucket } from '../entity/bucket.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('buckets')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBucket(
    @Body('name') name: string,
    @Req() req
    
  ) {
    
    return this.bucketService.createBucket(req.user,name);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBucketsForUser(@Req() req){
    return this.bucketService.getAllBuckets(req.user);
  }

  @Get('/:bucketId')
  @UseGuards(JwtAuthGuard)
  async getBucketById(@Param('bucketId') bucketId: number,@Req() req){
    return this.bucketService.getBucketById(bucketId,req.user);
  }

  @Patch('/:bucketId')
    @UseGuards(JwtAuthGuard)
  async updateBucketName(
    @Param('bucketId') bucketId: number,
    @Body('name') newName: string
    ,@Req() req
  ){
    return this.bucketService.updateBucketName(bucketId, newName,req.user);
  }

  @Delete('/:bucketId')
  @UseGuards(JwtAuthGuard)
  async deleteBucket(@Param('bucketId') bucketId: number,@Req() req) {
    return this.bucketService.deleteBucket(bucketId,req.user);
  }

  
}
