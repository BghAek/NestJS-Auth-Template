import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { EmailService } from "./email.service.js";
import { UsersModule } from "../users/users.module.js";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller.js";


@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule { }