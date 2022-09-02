exports.userCreateMailTemplate = (data) => {
    var mailBody = "";
            mailBody += '<div style="background-color:#000; margin-bottom:150px;">';
            mailBody += '<div style="margin-top:150px;">';
            mailBody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
            mailBody += 'Olá,';
            mailBody += '</p>';
            mailBody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
            mailBody += 'Seu código de verificação é {token}';
            mailBody += '</p>';
            mailBody += '</div>';
            mailBody += '</div>';
            mailBody = mailBody.replace('{token}', data.verificationcode);
            return mailBody;
}