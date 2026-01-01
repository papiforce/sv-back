const resetPasswordEmail = (name: string) => `
  <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Mot de passe modifié avec succès</title>
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
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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
    /* Success icon */
    .success-badge {
      text-align: center;
      margin: 20px 0 30px;
    }
    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
    }
    /* Success box */
    .success-box {
      background-color: #d4edda;
      border-left: 4px solid #28a745;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
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
    /* Info box */
    .info-box {
      background-color: #e8f4fd;
      border-left: 4px solid #667eea;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    .info-title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 15px;
    }
    .info-list {
      margin: 0;
      padding-left: 20px;
      color: #555555;
      font-size: 14px;
      line-height: 2;
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
      .success-icon {
        width: 70px !important;
        height: 70px !important;
        font-size: 40px !important;
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
            <td class="header" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
              <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 700; color: #ffffff; line-height: 1.3;">
                ✅ Mot de passe modifié
              </h1>
              <p style="font-size: 16px; margin: 0; opacity: 0.95; line-height: 1.5; color: #ffffff;">
                Votre compte est maintenant sécurisé
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px 30px;">
              
              <!-- Success icon -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="success-badge" style="text-align: center; padding: 20px 0 30px 0;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 48px; box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3); line-height: 80px; text-align: center; vertical-align: middle;">
                      ✓
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Welcome text -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="text-content" style="font-size: 16px; line-height: 1.8; color: #333333; margin-bottom: 20px;">
                    <p style="margin: 0 0 20px 0;">
                      Bonjour <strong>${name}</strong>,
                    </p>
                    
                    <p style="margin: 0 0 20px 0;">
                      Nous vous confirmons que votre mot de passe a été modifié avec succès le <strong>${new Date().toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}</strong>.
                    </p>
                    
                    <p style="margin: 0;">
                      Vous pouvez dès maintenant vous connecter à votre compte <strong>Scanverse</strong> avec votre nouveau mot de passe.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Success Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="success-box" style="background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                    <p style="margin: 0; color: #155724; font-size: 16px; line-height: 1.6; font-weight: 600;">
                      🔒 Votre compte est maintenant sécurisé avec votre nouveau mot de passe
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="warning-box" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; padding: 15px; margin: 25px 0; font-size: 13px; color: #856404; line-height: 1.6;">
                    <p style="margin: 0 0 10px 0;">
                      <strong>⚠️ Vous n'êtes pas à l'origine de cette modification ?</strong>
                    </p>
                    <p style="margin: 0;">
                      Si vous n'avez pas demandé ce changement, votre compte pourrait être compromis. 
                      <strong>Contactez immédiatement notre équipe support</strong> à l'adresse : 
                      <a href="mailto:support@scanverse.fr" style="color: #667eea; text-decoration: none; font-weight: 600;">
                        support@scanverse.fr
                      </a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Tips -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="info-box" style="background-color: #e8f4fd; border-left: 4px solid #667eea; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <p class="info-title" style="font-size: 16px; font-weight: 600; color: #333333; margin: 0 0 15px 0;">
                      🛡️ Bonnes pratiques de sécurité
                    </p>
                    <ul class="info-list" style="margin: 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 2;">
                      <li>Utilisez un <strong>mot de passe unique</strong> pour chaque service en ligne</li>
                      <li><strong>Ne partagez jamais</strong> votre mot de passe avec qui que ce soit</li>
                      <li>Changez votre mot de passe <strong>tous les 3 à 6 mois</strong></li>
                      <li>Utilisez un <strong>gestionnaire de mots de passe</strong> pour plus de sécurité</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Final text -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-size: 16px; line-height: 1.6; color: #666666; padding-top: 10px; text-align: center;">
                    <p style="margin: 0;">
                      Merci de faire confiance à <strong style="color: #333333;">Scanverse</strong> ! 🚀
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

              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999999;">
                Des questions ? Contactez notre support : <a href="mailto:support@scanverse.fr" style="color: #667eea; text-decoration: none;">support@scanverse.fr</a>
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

export default resetPasswordEmail;
