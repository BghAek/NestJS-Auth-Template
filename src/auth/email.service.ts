import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";


@Injectable()
export class EmailSrvice {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendVerificationEmail(email: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL');
    const verificationUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

    await this.resend.emails.send({
      // TODO: to be switched the desired doamin name in production
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 40px; text-align: center;">
       <h2>Welcome 👋</h2>
        <p>Verify your email to finish setting up your account.</p>
         <a href="${verificationUrl}" style="display:inline-block; padding:12px 24px; background:#000; color:#fff; text-decoration:none; border-radius:6px;" >
          Verify Email 
        </a> 
        <p style="color:#888; font-size:12px; margin-top:24px;"> This link expires in 24 hours. </p> </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL');
    const resetdUrl = `${appUrl}/api/auth/reset-password?token=${token}`;

    await this.resend.emails.send({
      // TODO: to be switched the desired doamin name in production
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `
      <div>
        <h3>Reset your password</h3>
        <p>Click below to reset your password.</p>
        <a href="${resetdUrl}">Reset Password</a>
         <p>If you didn't request this, ignore this email.</p>
      </div>
      `,
    });
  }

}