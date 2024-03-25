import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BucketController } from '../controller/bucket.controller';
import { BucketService } from '../service/bucket.service';
import { Bucket } from '../entity/bucket.entity';

import { File } from 'src/modules/files/entities/file.entity'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/user.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Bucket,File ,User ]),
      JwtModule.register({ // Configure JwtModule with your options
        secret: 'secret', // Replace with your secret key
        signOptions: { expiresIn: '1h' }, // Example expiry time
      }),
  
  ],
  controllers: [
    BucketController
  ],
  providers: [BucketService,JwtService,JwtModule],
  exports: [BucketService],
})
export class BucketModule {}
