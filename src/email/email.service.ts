import { Inject, Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import emailConfig from '../config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>
  ) {
    // this.transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: 'ararajo@gmail.com', //TODO: config
    //     pass: 'bmutwhywcfrmwjrh' //TODO: config
    //   }
    // });
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
      }
    });
  }

  async sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string) {
    const baseUrl = 'http://localhost:16710'; // TODO: config

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action='${url}' method='POST'>
          <button>가입확인</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
