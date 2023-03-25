import { Injectable } from '@nestjs/common';
import Mailjet from 'node-mailjet';
import {ISendVerifyAccount} from "./mailjet.interface";

@Injectable()
export class MailjetService {
  private mailjet: Mailjet;
  private readonly VERIFY_ACCOUNT_TEMPLATE_ID = 4523730;
  private readonly EMAIL_SENDER = 'admin@nmtung.dev';
  private readonly NAME_SENDER = 'Admin from Memorito';

  constructor() {
    this.mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET,
    });
  }

  sendVerifyAccount(dto:ISendVerifyAccount) {
    this.mailjet
      .post('send', {
        version: 'v3.1',
      })
      .request({
        Messages: [
          {
            From: {
              Email: this.EMAIL_SENDER,
              Name: this.NAME_SENDER
            },
            To: [
              {
                Email: dto.email,
                Name: dto.name,
              },
            ],
            TemplateID: this.VERIFY_ACCOUNT_TEMPLATE_ID,
            TemplateLanguage: true,
            Subject: 'Memorito | Verify your account',
            Variables: {
              name: dto.name,
              url: `https://memorito.nmtung.dev/verify-account/${dto.userId}/${dto.code}`
            },
          },
        ],
      }).then().catch();
  }
}
