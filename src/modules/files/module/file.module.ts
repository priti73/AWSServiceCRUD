import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from '../controllers/file.controller';
import { FileService } from '../services/file.service';
import { File } from '../entities/file.entity';
import { ConfigModule } from '@nestjs/config';
import { Bucket } from 'src/modules/buckets/entity/bucket.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      File,Bucket
    ]),
    JwtModule.register({ // Configure JwtModule with your options
      secret: 'secret', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Example expiry time
    }),
  ],
  controllers: [
    FileController
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
