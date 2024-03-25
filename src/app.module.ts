import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfigAsync } from './config/typeorm.config';
import { FilesModule } from './modules/files/module/file.module';
import { UsersModule } from './modules/user/user.module';
import { BucketModule } from './modules/buckets/module/bucket.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    FilesModule,
    UsersModule,
   BucketModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
