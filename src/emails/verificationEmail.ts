const verificationEmail = (username: string, link: string): string => `
  <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Vérifiez votre adresse email</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    /* Reset styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f7;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }
    /* Container principal */
    .email-wrapper {
      width: 100%;
      background-color: #f4f4f7;
      padding: 20px 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    /* Header */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      font-size: 28px;
      margin: 0 0 10px 0;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
    }
    .header p {
      font-size: 16px;
      margin: 0;
      opacity: 0.95;
      line-height: 1.5;
      color: #ffffff;
    }
    /* Content */
    .content {
      padding: 40px 30px;
    }
    .welcome-text {
      font-size: 16px;
      line-height: 1.8;
      color: #333333;
      margin-bottom: 30px;
    }
    .welcome-text p {
      margin: 0 0 16px 0;
    }
    .welcome-text p:last-child {
      margin-bottom: 0;
    }
    /* Bouton CTA */
    .button-section {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      mso-hide: all;
    }
    /* Lien alternatif */
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
      margin: 0 0 10px 0;
      font-weight: 600;
    }
    .link-text {
      font-size: 13px;
      color: #667eea;
      word-break: break-all;
      line-height: 1.6;
      font-family: 'Courier New', monospace;
      margin: 0;
    }
    /* Info box */
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
    /* Footer */
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
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0 !important;
      }
      .header {
        padding: 30px 20px !important;
      }
      .header h1 {
        font-size: 24px !important;
      }
      .content {
        padding: 30px 20px !important;
      }
      .cta-button {
        padding: 14px 30px !important;
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7;">
  
  <!-- Wrapper principal -->
  <table role="presentation" class="email-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        
        <!-- Container principal -->
        <table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
              <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 700; color: #ffffff; line-height: 1.3;">
                👋 Bienvenue ${username} !
              </h1>
              <p style="font-size: 16px; margin: 0; opacity: 0.95; line-height: 1.5; color: #ffffff;">
                Une dernière étape pour activer votre compte
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px 30px;">
              
              <!-- Welcome text -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="welcome-text" style="font-size: 16px; line-height: 1.8; color: #333333; margin-bottom: 30px;">
                    <p style="margin: 0 0 16px 0;">Bonjour <strong>${username}</strong>,</p>
                    <p style="margin: 0 0 16px 0;">
                      Merci de vous être inscrit sur <strong>Scanverse</strong> ! 
                      Nous sommes ravis de vous compter parmi notre communauté.
                    </p>
                    <p style="margin: 0;">
                      Pour activer votre compte et profiter de toutes les fonctionnalités, 
                      veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="button-section" style="text-align: center; padding: 30px 0;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${link}" style="height:50px;v-text-anchor:middle;width:220px;" arcsize="16%" stroke="f" fillcolor="#667eea">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">✅ Confirmer mon email</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${link}" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                      ✅ Confirmer mon email
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Link alternative -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="link-section" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; border-left: 4px solid #667eea;">
                    <p class="link-label" style="font-size: 13px; color: #666666; margin: 0 0 10px 0; font-weight: 600;">
                      Ou copiez-collez ce lien dans votre navigateur :
                    </p>
                    <p class="link-text" style="font-size: 13px; color: #667eea; word-break: break-all; line-height: 1.6; font-family: 'Courier New', monospace; margin: 0;">
                      ${link}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="info-box" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; padding: 15px; font-size: 13px; color: #856404; line-height: 1.6;">
                    <strong>⏱️ Attention :</strong> Ce lien de vérification expire dans <strong>24 heures</strong>. 
                    Pensez à confirmer votre email rapidement pour ne pas perdre l'accès à votre compte.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 13px; color: #666666; line-height: 1.6;">
              <p style="margin: 0 0 15px 0;">
                <strong style="color: #333333;">Scanverse</strong> - Votre compagnon manga & manhwa
              </p>

              <div class="footer-warning" style="margin-top: 15px; font-size: 12px; color: #999999; line-height: 1.6;">
                Vous n'avez pas créé de compte sur Scanverse ? Vous pouvez ignorer cet email en toute sécurité.<br>
                Aucune action ne sera effectuée sur votre adresse email.
              </div>

              <p style="margin: 20px 0 0 0; font-size: 11px; color: #999999;">
                © ${new Date().getFullYear()} Scanverse. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
        <!-- Fin container principal -->

      </td>
    </tr>
  </table>
  <!-- Fin wrapper -->

</body>
</html>
`;

export default verificationEmail;
