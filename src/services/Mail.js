import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

class Mail {
  constructor(env = '') {
    if (env === 'test') {
      this.connection = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.TEST_MAIL_USER,
          pass: process.env.TEST_MAIL_PASS,
        },
      });
    } else {
      this.connection = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    }
  }

  async sendMail({ to, subject, from = null, templateData }) {
    const templateFileContent = await fs.promises.readFile(
      templateData.template,
      {
        encoding: 'utf-8',
      },
    );
    const template = handlebars.compile(templateFileContent);

    const message = await this.connection.sendMail({
      from: {
        name: from ? from.name : 'Equipe Adoraveis',
        address: from ? from.email : 'equipe@adoraveis.com.br',
      },
      to: {
        name: to.name,
        address: to.address,
      },
      subject,
      html: await template(templateData.variables),
    });

    console.log('Message send: %s', message.messageId);
  }
}

export default Mail;
