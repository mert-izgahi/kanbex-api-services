import nodemailer from "nodemailer";
import configs from "../configs";
import { logger } from "./logger";
import { IWorkspace } from "../models/workspace.model";
import { IAccount } from "../models/account.model";
import { IInvite } from "../models/invite.model";
import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);



class Mailer {
  // private transporter = nodemailer.createTransport({
  //   host: configs.MAIL_HOST,
  //   port: 2525,
  //   auth: {
  //     user: configs.MAIL_USER,
  //     pass: configs.MAIL_PASS,
  //   },
  // });
  private transporter = mailgun.client({
    username: "api",
    key: configs.MAILGUN_API_KEY!
  });
  
  async sendInvitationEmail(
    to: string,
    workspace: IWorkspace,
    inviter: IAccount,
    invite: IInvite
  ) {
    const data = await this.transporter.messages.create(configs.MAILGUN_DOMAIN!, {
      from: configs.MAIL_FROM,
      to,
      subject: `You have been invited to join ${workspace.name}`,
      html: `
        <h1>You have been invited to join ${workspace.name}</h1>
        <p>Inviter: ${inviter.email}</p>
        <p>Invite code: ${invite.inviteCode}</p>
        <p>Accept the invite here: <a href="${configs.CLIENT_URL}/workspaces/${workspace._id}/invites/${invite.inviteCode}">Accept invite</a></p>
      `,
    })

    logger.info(data);
  }
}

export const mailer = new Mailer();
