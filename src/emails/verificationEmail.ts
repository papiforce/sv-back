const verificationEmail = (username: string, link: string) => `<!DOCTYPE html>
      <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérifiez votre adresse email</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f7;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
      line-height: 1.5;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-text {
      font-size: 16px;
      line-height: 1.8;
      color: #333333;
      margin-bottom: 30px;
    }
    .button-section {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .link-section {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      border-left: 4px solid #667eea;
    }
    .link-label {
      font-size: 13px;
      color: #666666;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .link-text {
      font-size: 13px;
      color: #667eea;
      word-break: break-all;
      line-height: 1.6;
      font-family: 'Courier New', monospace;
    }
    .info-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      padding: 15px;
      margin: 25px 0;
      font-size: 13px;
      color: #856404;
      line-height: 1.6;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #666666;
      line-height: 1.6;
    }
    .footer-warning {
      margin-top: 15px;
      font-size: 12px;
      color: #999999;
      line-height: 1.6;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
      }
      .cta-button {
        padding: 14px 30px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>👋 Bienvenue ${username} !</h1>
      <p>Dernière étape pour activer votre compte</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="welcome-text">
        <p>Bonjour <strong>${username}</strong>,</p>
        <br>
        <p>
          Merci de vous être inscrit sur <strong>Scanverse</strong> ! 
          Nous sommes ravis de vous compter parmi nous.
        </p>
        <br>
        <p>
          Pour activer votre compte et commencer à profiter de toutes les fonctionnalités, 
          veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
        </p>
      </div>

      <!-- CTA Button -->
      <div class="button-section">
        <a href="${link}" class="cta-button">
          ✅ Vérifier mon email
        </a>
      </div>

      <!-- Link alternative -->
      <div class="link-section">
        <div class="link-label">Ou copiez ce lien dans votre navigateur :</div>
        <div class="link-text">${link}</div>
      </div>

      <!-- Warning box -->
      <div class="info-box">
        <strong>⏱️ Attention :</strong> Ce lien de vérification expire dans <strong>24 heures</strong>. 
        Pensez à vérifier votre email rapidement pour ne pas perdre l'accès à votre compte.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>Scanverse</strong> - Votre compagnon manga & manhwa
      </p>
      
      <div class="footer-warning">
        Si vous n'avez pas créé de compte sur Scanverse, vous pouvez ignorer cet email en toute sécurité.<br>
        Aucune action ne sera effectuée sur votre adresse email.
      </div>

      <p style="margin-top: 20px; font-size: 11px; color: #999999;">
        © ${new Date().getFullYear()} Scanverse. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
`;

export default verificationEmail;
