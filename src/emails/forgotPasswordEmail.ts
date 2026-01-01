const forgotPasswordEmail = (name: string, resetUrl: string) => `
  <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Réinitialisation de mot de passe</title>
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
    .text-content {
      font-size: 16px;
      line-height: 1.8;
      color: #333333;
      margin-bottom: 20px;
    }
    /* Button */
    .button-section {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 16px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    /* Link section */
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
    /* Warning box */
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      padding: 15px;
      margin: 25px 0;
      font-size: 13px;
      color: #856404;
      line-height: 1.6;
    }
    /* Security box */
    .security-box {
      background-color: #e8f4fd;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      padding: 15px;
      margin: 25px 0;
      font-size: 13px;
      color: #0c5460;
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
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
  
  <!-- Wrapper principal -->
  <table role="presentation" class="email-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 0;">
        
        <!-- Container principal -->
        <table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
              <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 700; color: #ffffff; line-height: 1.3;">
                🔐 Réinitialisation de mot de passe
              </h1>
              <p style="font-size: 16px; margin: 0; opacity: 0.95; line-height: 1.5; color: #ffffff;">
                Créez un nouveau mot de passe sécurisé
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px 30px;">
              
              <!-- Welcome text -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="text-content" style="font-size: 16px; line-height: 1.8; color: #333333; margin-bottom: 20px;">
                    <p style="margin: 0 0 20px 0;">
                      Bonjour <strong>${name}</strong>,
                    </p>
                    
                    <p style="margin: 0 0 20px 0;">
                      Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte <strong>Scanverse</strong>.
                    </p>
                    
                    <p style="margin: 0;">
                      Pour définir un nouveau mot de passe et retrouver l'accès à votre compte, cliquez sur le bouton ci-dessous :
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="button-section" style="text-align: center; padding: 30px 0;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="16%" strokecolor="#667eea" fillcolor="#667eea">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial, sans-serif;font-size:16px;font-weight:bold;">🔑 Créer un nouveau mot de passe</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${resetUrl}" class="cta-button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                      🔑 Créer un nouveau mot de passe
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Link alternative -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="link-section" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #667eea;">
                    <p class="link-label" style="font-size: 13px; color: #666666; margin: 0 0 10px 0; font-weight: 600;">
                      Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :
                    </p>
                    <p class="link-text" style="font-size: 13px; color: #667eea; word-break: break-all; line-height: 1.6; font-family: 'Courier New', monospace; margin: 0;">
                      ${resetUrl}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="warning-box" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; padding: 15px; margin: 25px 0; font-size: 13px; color: #856404; line-height: 1.6;">
                    <p style="margin: 0;">
                      <strong>⏱️ Attention :</strong> Ce lien de réinitialisation expire dans <strong>1 heure</strong> pour des raisons de sécurité. Pensez à créer votre nouveau mot de passe rapidement.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="security-box" style="background-color: #e8f4fd; border-left: 4px solid #667eea; border-radius: 4px; padding: 15px; margin: 25px 0; font-size: 13px; color: #0c5460; line-height: 1.6;">
                    <p style="margin: 0 0 10px 0;">
                      <strong>🛡️ Conseils de sécurité :</strong>
                    </p>
                    <p style="margin: 0; padding-left: 15px;">
                      • Choisissez un mot de passe d'au moins 8 caractères<br>
                      • Mélangez lettres majuscules, minuscules et chiffres<br>
                      • Évitez d'utiliser des informations personnelles<br>
                      • N'utilisez jamais le même mot de passe sur plusieurs sites
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Final text -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-size: 14px; line-height: 1.6; color: #666666; padding-top: 10px;">
                    <p style="margin: 0 0 15px 0;">
                      <strong>Vous n'avez pas demandé cette réinitialisation ?</strong>
                    </p>
                    <p style="margin: 0;">
                      Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel reste inchangé et votre compte est protégé.
                    </p>
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

export default forgotPasswordEmail;
