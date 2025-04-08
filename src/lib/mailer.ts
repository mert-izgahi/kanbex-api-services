import configs from "../configs";
import { logger } from "./logger";
import { IWorkspace } from "../models/workspace.model";
import { IAccount } from "../models/account.model";
import { IInvite } from "../models/invite.model";
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

class Mailer {
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

    await sgMail
      .send({
        to,
        from: configs.MAIL_FROM,
        subject,
        html,
      })
      .then(() => {
        logger.info(`Email sent to ${to}`);
      })
      .catch((error:any) => {
        logger.error(`Error sending email to ${to}: ${error}`);
      });
  }
}

export const mailer = new Mailer();
