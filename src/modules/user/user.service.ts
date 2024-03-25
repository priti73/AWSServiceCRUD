import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./user.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { username, password, email } = createUserDto;

      const existingUser = await this.userRepo.findOne({where:{email: email }});

      if (existingUser) {
        return `${email} is already registered`;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.userRepo.create({
        email,
        username,
        password: hashedPassword,
      });

      await this.userRepo.save(newUser);

      return {
        status: 201,
        message: 'Signed up successfully',
      };
    } catch (error) {
      throw error;
    }
  }


  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({where:{email:email}});
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
  generateToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role,name:user.username }; 
    return this.jwtService.sign(payload, { secret: 'secret' })
  }

 }


