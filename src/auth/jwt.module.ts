import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret', // Provide your secret key here
      signOptions: { expiresIn: '1h' }, // Adjust expiration as needed
    }),
  ],
  providers: [JwtAuthGuard,JwtStrategy],
  exports: [JwtAuthGuard], // Export JwtAuthGuard to be used in other modules
})
export class JwtAuthModule {}
