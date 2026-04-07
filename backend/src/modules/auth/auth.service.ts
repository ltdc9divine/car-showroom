import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Create new user
    const user = await this.userModel.create({
      email,
      password,
      name,
      role: UserRole.USER,
    });

    const token = this.generateToken(user._id, user.email, user.role);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user._id, user.email, user.role);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(userId: any, email: string, role: UserRole): string {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    console.log('[Auth] Generating token with secret:', secret.substring(0, 10) + '...');
    return this.jwtService.sign(
      { sub: userId, email, role } as any,
      { secret, expiresIn: (process.env.JWT_EXPIRATION || '24h') as any },
    );
  }

  async validateUser(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }
}
