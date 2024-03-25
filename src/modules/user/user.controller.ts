import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./user.dto";
import { UsersService } from "./user.service";
import { AuthService } from "src/auth/jwt.service";
import { LoginDto } from "./login.dto";


@Controller()
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
  
      private readonly authService: AuthService,
    ) {}
  
    @Post('/signup/user')
    async createUser(@Body() userDto: CreateUserDto) {
      return this.usersService.createUser({
     ...userDto,
      });
    }
    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
      const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        return { message: 'Invalid credentials' };
      }
      
     const token = this.usersService.generateToken(user);
      
     return { token };
    }
}