import {Injectable} from '@nestjs/common';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailjetService {
	private mailjet: Mailjet;

	constructor() {
		this.mailjet = new Mailjet({
			apiKey: process.env.MAILJET_API_KEY,
			apiSecret: process.env.MAILJET_API_SECRET
		});
	}

	async testSendEmail() {
		const temp = await this.mailjet.post('send', {
			version: 'v3.1'
		}).request({
			Messages: [
				{
					From: {
						Email: "admin@nmtung.dev",
						Name: "Admin from Memorito"
					},
					To: [
						{
							Email: "nmtungofficial@gmail.com",
							Name: "Nguyen Manh Tung"
						}
					],
					TemplateID: 4523730,
					TemplateLanguage: true,
					Subject: "Memorito | Verify your account",
					Variables: {
						name: "Nguyen Manh Tung",
						url: "https://www.nmtung.dev/"
					}
				}
			]
		});
		console.log(temp);
	}
}
