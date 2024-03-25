import { Body, Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { ApiConsumes } from '@nestjs/swagger';
import { fileDto } from '../dto/createFile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';


@Controller('object')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  
  @Post(':bucketId/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    dest: './.utils/upload', 
  }))
  @ApiConsumes('multipart/form-data') 
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('bucketId') bucketId: number,
    @Body() filedto: fileDto, @Req() req
  ) {
    return await this.fileService.createObject(file, bucketId, filedto,req.user);
  }

  @Get(':objectId')
  @UseGuards(JwtAuthGuard)
  async getFileById(@Param('objectId') objectId: number, @Res() res: Response,@Req() req) {
    await this.fileService.getFileById(objectId, res,req.user);
  }

  @Delete(':objectId')
  @UseGuards(JwtAuthGuard)
  async deleteFile(@Param('objectId') objectId: number,@Req() req) {
    return await this.fileService.deleteObject(objectId,req.user);
  }

  @Get('download/:objectId')
  async downloadFile(@Param('objectId') objectId: number, @Res() res: Response) {
    return this.fileService.downloadFile(objectId, res);
  }

}