module.exports = function(emailAddrTo, emailAddrFrom, emailSubject, emailBody)
{
	var mailer = require('nodemailer');
	transporter = mailer.createTransport();
				transporter.sendMail(
				{
					from: emailAddrFrom,
					to: emailAddrTo,
					subject: emailSubject,
					text: emailBody
				});
}