import sgMail from '@sendgrid/mail';
import User from '../models/user';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendSignUpOtp = async (user) => {
  let a = Math.random();
  a = String(a);
  a = a.substring(2, 6);
  user.otp = a;
  await user.save();

  sgMail.send({
    to: user.email,
    from: 'sourav2fly@gmail.com',
    subject: 'OTP for Blockchain Wallet',
    text: `Welcome ${user.name} to the Blockchain wallet, your OTP is ${a}, please verify this to start using your wallet.`,
  });
};

const sendSignInOTP = async (user) => {
  let a = Math.random();
  a = String(a);
  a = a.substring(2, 6);
  user.otp = a;
  await user.save();

  sgMail.send({
    to: user.email,
    from: 'sourav2fly@gmail.com',
    subject: 'OTP for Blockchain Wallet',
    text: `Welcome ${user.name} \n To the Blockchain wallet. \n New LogIn request received. Your OTP is ${a}, please verify this to Login in into your wallet.`,
  });
};

const ReceivedTokenMail = async (
  senderEmail,
  receiverEmail,
  senderAcc,
  receiverAcc,
  amount,
  totalAmount,
  receiverName
) => {
  const subject = `${amount} Token has been credited into your account `;
  const matter = `Dear ${receiverName} \n ${amount} Token has been credited into your MyToken wallet from ${senderEmail} having account no. ${senderAcc}. \n Your available balance is ${totalAmount}`;

  sgMail.send({
    to: receiverEmail,
    from: 'sourav2fly@gmail.com',
    subject,
    text: matter,
  });
};

const sendTokenMail = async (
  senderEmail,
  receiverEmail,
  senderAcc,
  receiverAcc,
  amount,
  totalAmount,
  senderName
) => {
  const subject = `${amount} Token has been debited from your account `;
  const matter = `Dear ${senderName} \n ${amount} Token has been debited from your MyToken wallet to ${receiverEmail} having account no. ${receiverAcc}. \n Your available balance is ${totalAmount}`;

  sgMail.send({
    to: senderEmail,
    from: 'sourav2fly@gmail.com',
    subject,
    text: matter,
  });
};

const stakeTokenMail = async (senderEmail, amount, senderName) => {
  const subject = `${amount} Token has been staked `;
  const matter = `Dear ${senderName} \n ${amount} MTK Token has been staked, you had started earning staking reward. Maturity period is 21 days.\n Don't forget to claim the reward after 21 days.\n Note: You can unstake your token anytime you want but the reward will be based upon the nuper of days you have staked the token. \n Remenber: Always claim the reward before unstaking the token`;

  sgMail.send({
    to: senderEmail,
    from: 'sourav2fly@gmail.com',
    subject,
    text: matter,
  });
};

const unstakeTokenMail = async (senderEmail, amount, senderName) => {
  const subject = `${amount} Token has been unstaked `;
  const matter = `Dear ${senderName} \n ${amount} MTK Token has been unstaked, You can again stake it and earn reward.`;

  sgMail.send({
    to: senderEmail,
    from: 'sourav2fly@gmail.com',
    subject,
    text: matter,
  });
};

const claimBonusMail = async (senderEmail, amount, senderName) => {
  const subject = `${amount} Token has been rewarded to you as a bonus `;
  const matter = `Dear ${senderName} \n ${amount} MTK Token has been rewarded to you as a bonus, your staking time has been reset.`;

  sgMail.send({
    to: senderEmail,
    from: 'sourav2fly@gmail.com',
    subject,
    text: matter,
  });
};

module.exports = {
  sendSignUpOtp,
  sendSignInOTP,
  ReceivedTokenMail,
  sendTokenMail,
  stakeTokenMail,
  unstakeTokenMail,
  claimBonusMail,
};
