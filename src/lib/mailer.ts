import nodemailer from "nodemailer";
import configs from "../configs";
import { logger } from "./logger";
import { IWorkspace } from "../models/workspace.model";
import { IAccount } from "../models/account.model";
import { IInvite } from "../models/invite.model";

class Mailer {
  private transporter = nodemailer.createTransport({
    host: configs.MAIL_HOST,
    port: 2525,
    auth: {
      user: configs.MAIL_USER,
      pass: configs.MAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: configs.MAIL_FROM,
        to,
        subject,
        html,
      });
      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error(`Error sending email to ${to}: ${error}`);
    }
  }

  async sendInvitationEmail(
    to: string,
    workspace: IWorkspace,
    inviter: IAccount,
    invite: IInvite
  ) {
    const subject = `You have been invited to join ${workspace.name}`;

    const html = `
      <h1>You have been invited to join ${workspace.name}</h1>
      <p>Inviter: ${inviter.email}</p>
      <p>Invite code: ${invite.inviteCode}</p>
      <p>Accept the invite here: <a href="${configs.CLIENT_URL}/workspaces/${workspace._id}/invites/${invite.inviteCode}">Accept invite</a></p>
    `;

    await this.sendMail(to, subject, html);
  }
}

export const mailer = new Mailer();
