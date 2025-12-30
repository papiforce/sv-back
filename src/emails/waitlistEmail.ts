const waitlistEmail = (): string => `
  <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Bienvenue dans la liste d'attente Scanverse</title>
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
    /* Section récompense principale */
    .reward-highlight {
      background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
      border-radius: 8px;
      padding: 25px;
      margin: 30px 0;
      text-align: center;
      border-left: 4px solid #fdcb6e;
    }
    .reward-icon {
      font-size: 48px;
      margin-bottom: 15px;
      line-height: 1;
    }
    .reward-title {
      font-size: 18px;
      font-weight: 700;
      color: #333333;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    .reward-text {
      font-size: 14px;
      color: #555555;
      line-height: 1.7;
    }
    /* Section avantages */
    .benefits-section {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 30px 25px;
      margin: 30px 0;
    }
    .benefits-title {
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 20px;
      text-align: center;
    }
    .benefit-item {
      margin-bottom: 18px;
      font-size: 14px;
      color: #555555;
      line-height: 1.7;
      padding-left: 36px;
      position: relative;
    }
    .benefit-item:last-child {
      margin-bottom: 0;
    }
    .benefit-icon {
      background-color: #667eea;
      color: #ffffff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      position: absolute;
      left: 0;
      top: 0;
    }
    /* Info box */
    .info-box {
      background-color: #f3e8ff;
      border-left: 4px solid #667eea;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      font-size: 14px;
      color: #555555;
      line-height: 1.7;
    }
    .info-box strong {
      color: #333333;
    }
    /* Call to action */
    .cta-section {
      text-align: center;
      margin: 35px 0;
    }
    .cta-text {
      font-size: 14px;
      color: #666666;
      margin: 0 0 15px 0;
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
    .footer p {
      margin: 0 0 10px 0;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    .social-links {
      margin: 20px 0 15px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    .divider {
      color: #cccccc;
      margin: 0 5px;
    }
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 10px 0 !important;
      }
      .email-container {
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      .header {
        padding: 30px 20px !important;
      }
      .header h1 {
        font-size: 24px !important;
      }
      .header p {
        font-size: 14px !important;
      }
      .content {
        padding: 30px 20px !important;
      }
      .welcome-text {
        font-size: 15px !important;
      }
      .reward-highlight {
        padding: 20px !important;
      }
      .reward-icon {
        font-size: 40px !important;
      }
      .reward-title {
        font-size: 16px !important;
      }
      .reward-text {
        font-size: 13px !important;
      }
      .benefits-section {
        padding: 25px 20px !important;
      }
      .benefit-item {
        font-size: 13px !important;
        padding-left: 32px !important;
      }
      .benefit-icon {
        width: 22px !important;
        height: 22px !important;
        font-size: 12px !important;
      }
      .info-box {
        padding: 15px !important;
        font-size: 13px !important;
      }
      .footer {
        padding: 25px 20px !important;
      }
      .social-links a {
        display: block !important;
        margin: 8px 0 !important;
      }
      .divider {
        display: none !important;
      }
    }
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #ffffff !important;
      }
      .welcome-text,
      .welcome-text p,
      .reward-title,
      .reward-text,
      .benefits-title,
      .benefit-item,
      .info-box {
        color: #333333 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f7;">
  <!-- Wrapper pour compatibilité email -->
  <table role="presentation" class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        
        <!-- Container principal -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 700; color: #ffffff; line-height: 1.3;">
                🎊 Merci de votre inscription !
              </h1>
              <p style="font-size: 16px; margin: 0; opacity: 0.95; line-height: 1.5; color: #ffffff;">
                Vous êtes maintenant sur la liste d'attente de Scanverse
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px 30px;">
              
              <!-- Welcome text -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="welcome-text" style="font-size: 16px; line-height: 1.8; color: #333333; padding-bottom: 30px;">
                    <p style="margin: 0 0 16px 0;">Bonjour,</p>
                    <p style="margin: 0 0 16px 0;">
                      Nous sommes ravis de vous compter parmi les premiers intéressés par <strong>Scanverse</strong>, 
                      votre future plateforme de suivi de mangas et manhwas !
                    </p>
                    <p style="margin: 0;">
                      <strong>📧 Vous recevrez un email dès le lancement officiel</strong> de la plateforme 
                      pour être parmi les premiers à découvrir toutes les fonctionnalités.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Reward Highlight -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 30px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); border-radius: 8px; border-left: 4px solid #fdcb6e;">
                      <tr>
                        <td style="padding: 25px; text-align: center;">
                          <div style="font-size: 48px; margin-bottom: 15px; line-height: 1;">🎁</div>
                          <div style="font-size: 18px; font-weight: 700; color: #333333; margin-bottom: 12px; line-height: 1.3;">
                            Gagnez 1 mois d'abonnement Passionné !
                          </div>
                          <div style="font-size: 14px; color: #555555; line-height: 1.7;">
                            Lors de votre inscription, vous recevrez un <strong>code de parrainage unique</strong>. 
                            Partagez-le avec vos amis et dès que <strong>3 personnes s'inscrivent avec votre code</strong>, 
                            vous recevez <strong>1 mois du plan Passionné offert</strong> ! 🎉
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Benefits Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 30px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px;">
                      <tr>
                        <td style="padding: 30px 25px;">
                          <div style="font-size: 18px; font-weight: 600; color: #333333; margin-bottom: 20px; text-align: center;">
                            🚀 Comment ça marche ?
                          </div>

                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding-bottom: 18px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="36" valign="top" style="padding-right: 12px;">
                                      <div style="background-color: #667eea; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; text-align: center; line-height: 24px;">1</div>
                                    </td>
                                    <td style="font-size: 14px; color: #555555; line-height: 1.7;">
                                      <strong>À l'inscription :</strong> Vous recevrez votre code de parrainage unique que vous pourrez retrouver dans votre profil
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 18px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="36" valign="top" style="padding-right: 12px;">
                                      <div style="background-color: #667eea; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; text-align: center; line-height: 24px;">2</div>
                                    </td>
                                    <td style="font-size: 14px; color: #555555; line-height: 1.7;">
                                      <strong>Partagez-le</strong> avec vos amis passionnés de mangas et manhwas
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="36" valign="top" style="padding-right: 12px;">
                                      <div style="background-color: #667eea; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; text-align: center; line-height: 24px;">3</div>
                                    </td>
                                    <td style="font-size: 14px; color: #555555; line-height: 1.7;">
                                      <strong>Récupérez votre récompense :</strong> Dès que 3 personnes s'inscrivent avec votre code, vous gagnez 1 mois gratuit !
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 25px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3e8ff; border-left: 4px solid #667eea; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px; font-size: 14px; color: #555555; line-height: 1.7;">
                          <strong style="color: #333333;">💡 Important :</strong> 
                          Gardez cette adresse email précieusement ! Vous devrez l'utiliser lors de votre inscription 
                          sur Scanverse pour profiter de votre code de parrainage et recevoir nos notifications de lancement.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center; padding: 35px 0 20px 0;">
                    <p style="font-size: 14px; color: #666666; margin: 0 0 15px 0;">
                      En attendant le lancement, rejoignez notre communauté !
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 13px; color: #666666; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #333333;">Scanverse</strong> - Votre compagnon manga & manhwa
              </p>

              <div style="margin: 20px 0 15px 0;">
                <a href="#" style="display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; font-weight: 600;">Discord</a>
                <span style="color: #cccccc; margin: 0 5px;">•</span>
                <a href="#" style="display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; font-weight: 600;">Twitter</a>
                <span style="color: #cccccc; margin: 0 5px;">•</span>
                <a href="#" style="display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; font-weight: 600;">Site Web</a>
              </div>

              <p style="margin: 15px 0 0 0; font-size: 11px; color: #999999;">
                © ${new Date().getFullYear()} Scanverse. Tous droits réservés.
              </p>
              
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #999999;">
                Vous recevez cet email car vous vous êtes inscrit à la liste d'attente de Scanverse.
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

export default waitlistEmail;
