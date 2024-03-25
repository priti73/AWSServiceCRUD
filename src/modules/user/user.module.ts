import { Module, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthModule } from 'src/auth/jwt.module';
import { AuthService } from 'src/auth/jwt.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      User,
      JwtAuthModule
    ]),

  
  ],
  controllers: [UsersController],
  providers: [UsersService,JwtService,AuthService],
  exports: [UsersService],
})
export class UsersModule {
  
}
