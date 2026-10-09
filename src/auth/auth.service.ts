import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service.js";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service.js";
import { RegisterDTO } from "./dto/register.dto.js";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto"


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService
  ) { }

  async register(dto: RegisterDTO) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000 // 24 hours form now 
    )

    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      verificationToken,
      verificationTokenExpiresAt,
    });
    // If we "await" the sendVerificationEmail the API will slow , it's better to use "void" just fire and forget
    void this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      message: 'Registration Successful. Pleace check your email to verify your account'
    }

  }

}