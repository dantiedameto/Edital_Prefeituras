import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Tender } from '@prisma/client';

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;
  private fromAddress: string;
  private isMock = true;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('SMTP_HOST');
    this.fromAddress =
      this.configService.get<string>('SMTP_FROM') ?? 'Central de Editais <alertas@centraldeeditais.com.br>';

    if (host) {
      this.isMock = false;
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('SMTP_PORT') ?? 587,
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
      this.logger.log(`SMTP configurado (${host}) — envio real de e-mails habilitado.`);
    } else {
      this.logger.warn('SMTP_HOST não configurado — e-mails serão apenas logados no console (modo mock).');
    }
  }

  async sendAlertEmail(to: string, tender: Tender): Promise<void> {
    const subject = `Novo edital compatível: ${tender.title}`;
    const html = `
      <p>Olá,</p>
      <p>Encontramos um novo edital que combina com um dos seus filtros de interesse:</p>
      <h3>${tender.title}</h3>
      <p><strong>Órgão:</strong> ${tender.publicOrg}<br/>
      <strong>Local:</strong> ${tender.city}/${tender.state}<br/>
      <strong>Prazo:</strong> ${tender.deadlineDate.toLocaleDateString('pt-BR')}</p>
      <p>Acesse a Central de Editais Públicos para ver todos os detalhes.</p>
    `;

    if (this.isMock) {
      this.logger.log(`[MOCK EMAIL] Para: ${to} | Assunto: ${subject}`);
      return;
    }

    await this.transporter.sendMail({ from: this.fromAddress, to, subject, html });
  }
}
