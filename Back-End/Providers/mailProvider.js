module.exports = function sendMail(to,cc,subject,html){
    const nodemailer = require('nodemailer');

    const smtpTransport = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USERNAMEACCOUNT,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: process.env.SMTP_FROM,
        to,
        cc,
        bcc: process.env.SMTP_USERNAMEACCOUNT,
        subject,
        html
    };

    smtpTransport.sendMail(message, (err, res) =>{
        if(err){
            console.log(`Não Foi Possível Enviar o E-mail. Erro:${err}`);
        } else {
            console.log('E-mail de Recuperação Enviado com Sucesso !')
        }
        smtpTransport.close();
    });
};