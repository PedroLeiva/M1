const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sendEmail/:id/:email', (req, res) => {
  const id = req.params.id;
  const email = req.params.email;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {user:'banktrackerhelp@gmail.com', pass: '#Gfgrupo1'}
  });

  transporter.sendMail({
    from: "BankTrackerHelp",
    to: email,
    replyTo: "banktrackerhelp@gmail.com",
    subject: "Recuperação de senha",
    text: `Acesse o link para atualizar sua senha: http://localhost:3000/pages/PasswordRecuperation/?${id}`,
  }).then(info =>{
    console.log(info);
    res.status(200).send('Email enviado com sucesso!');
  }).catch(error =>{
    console.log(error);
    res.status(403).send('Ops... algo deu errado');
  })
})

module.exports = router;
