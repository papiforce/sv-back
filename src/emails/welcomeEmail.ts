const welcomeEmail = (
  username: string,
  loginUrl: string,
  referralCode?: string
): string => `<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Compte activé avec succès</title>
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

        /* Success badge */
        .success-badge {
            text-align: center;
            padding: 20px 0 30px 0;
        }

        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            border-radius: 50%;
            display: inline-block;
            line-height: 80px;
            font-size: 48px;
            box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
            color: #ffffff;
        }

        /* Welcome text */
        .welcome-text {
            font-size: 16px;
            line-height: 1.8;
            color: #333333;
            text-align: center;
            padding: 0 20px;
        }

        /* Code de parrainage */
        .referral-section {
            background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            border: 2px solid #fdcb6e;
        }

        .referral-title {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin: 0 0 10px 0;
        }

        .referral-description {
            font-size: 13px;
            color: #555555;
            margin: 0 0 15px 0;
            line-height: 1.6;
        }

        .referral-code-box {
            background-color: #ffffff;
            border-radius: 6px;
            padding: 15px 20px;
            margin: 15px 0;
            border: 2px dashed #fdcb6e;
        }

        .referral-code {
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
            margin: 0;
        }

        .referral-benefit {
            font-size: 12px;
            color: #856404;
            margin: 10px 0 0 0;
            line-height: 1.5;
        }

        /* Features section */
        .features-section {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }

        .features-title {
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            margin: 0 0 20px 0;
            text-align: center;
        }

        .feature-item {
            margin-bottom: 15px;
            font-size: 14px;
            color: #555555;
            line-height: 1.6;
        }

        .feature-icon {
            background-color: #667eea;
            color: #ffffff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            line-height: 28px;
            font-size: 14px;
            font-weight: bold;
            margin-right: 12px;
            vertical-align: middle;
        }

        /* Bouton CTA */
        .button-section {
            text-align: center;
            padding: 30px 0;
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
        }

        /* Next steps */
        .next-steps {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #667eea;
        }

        .next-steps-title {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin: 0 0 15px 0;
        }

        .next-steps-item {
            font-size: 14px;
            color: #555555;
            line-height: 1.6;
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
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
                border-radius: 0 !important;
            }

            .header {
                padding: 30px 20px !important;
            }

            .header h1 {
                font-size: 24px !important;
            }

            .content-padding {
                padding: 30px 20px !important;
            }

            .cta-button {
                padding: 14px 30px !important;
                font-size: 15px !important;
            }

            .referral-code {
                font-size: 24px !important;
                letter-spacing: 2px !important;
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
                                🎉 Compte activé avec succès !
                            </h1>
                            <p style="font-size: 16px; margin: 0; opacity: 0.95; line-height: 1.5; color: #ffffff;">
                                Bienvenue dans l'aventure Scanverse
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content-padding" style="padding: 40px 30px;">

                            <!-- Success Badge -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="success-badge" style="text-align: center; padding: 20px 0 30px 0;">
                                        <div class="success-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 50%; display: inline-block; line-height: 80px; font-size: 48px; box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3); color: #ffffff;">
                                            ✓
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Welcome text -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="welcome-text" style="font-size: 16px; line-height: 1.8; color: #333333; text-align: center; padding: 0 20px;">
                                        <p style="margin: 0 0 16px 0;">Félicitations <strong>${username}</strong> ! 🎊</p>
                                        <p style="margin: 0;">
                                            Votre compte <strong>Scanverse</strong> est maintenant actif.<br>
                                            Vous pouvez dès à présent profiter de toutes nos fonctionnalités !
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            ${
                              referralCode
                                ? `<!-- Code de parrainage -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding: 30px 0 0 0;">
                                        <!-- Code de parrainage -->
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding: 30px 0 0 0;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); border-radius: 8px; border: 2px solid #fdcb6e;">
                                                        <tr>
                                                            <td style="padding: 25px; text-align: center;">
                                                                <p class="referral-title" style="font-size: 16px; font-weight: 600; color: #333333; margin: 0 0 10px 0;">
                                                                    🎁 Votre Code de Parrainage
                                                                </p>
                                                                <p class="referral-description" style="font-size: 13px; color: #555555; margin: 0 0 15px 0; line-height: 1.6;">
                                                                    Partagez ce code avec vos amis et débloquez des récompenses exclusives !
                                                                </p>

                                                                <!-- Code box -->
                                                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 6px; border: 2px dashed #fdcb6e; margin: 15px 0;">
                                                                    <tr>
                                                                        <td style="padding: 15px 20px; text-align: center;">
                                                                            <p class="referral-code" style="font-size: 28px; font-weight: 700; color: #667eea; letter-spacing: 3px; font-family: 'Courier New', monospace; margin: 0;">
                                                                                ${referralCode}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>

                                                                <p class="referral-benefit" style="font-size: 12px; color: #856404; margin: 10px 0 0 0; line-height: 1.5;">
                                                                    <strong>🎯 Comment ça marche ?</strong><br>
                                                                    Dès que <strong>3 de vos amis s'inscrivent avec votre code</strong> et souscrivent à un abonnement,
                                                                    vous gagnez <strong>1 mois du plan "Passionné" offert</strong> ! 🎉
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                    </td>
                                </tr>
                            </table>`
                                : ""
                            }

                            <!-- Features Section -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding: 30px 0 0 0;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8f9fa; border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 25px;">
                                                    <p class="features-title" style="font-size: 18px; font-weight: 600; color: #333333; margin: 0 0 20px 0; text-align: center;">
                                                        ✨ Découvrez ce que vous pouvez faire
                                                    </p>

                                                    <!-- Feature 1 -->
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td class="feature-item" style="margin-bottom: 15px; font-size: 14px; color: #555555; line-height: 1.6; padding-bottom: 15px;">
                                                                <span class="feature-icon" style="background-color: #667eea; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-size: 14px; font-weight: bold; margin-right: 12px; vertical-align: middle;">📚</span>
                                                                <strong>Créer votre bibliothèque personnelle</strong><br>
                                                                <span style="padding-left: 40px; display: inline-block;">Ajoutez vos mangas et manhwas préférés en quelques clics</span>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Feature 2 -->
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td class="feature-item" style="margin-bottom: 15px; font-size: 14px; color: #555555; line-height: 1.6; padding-bottom: 15px;">
                                                                <span class="feature-icon" style="background-color: #667eea; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-size: 14px; font-weight: bold; margin-right: 12px; vertical-align: middle;">📊</span>
                                                                <strong>Suivre votre progression de lecture</strong><br>
                                                                <span style="padding-left: 40px; display: inline-block;">Ne perdez plus jamais le fil de vos lectures en cours</span>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Feature 3 -->
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td class="feature-item" style="margin-bottom: 15px; font-size: 14px; color: #555555; line-height: 1.6; padding-bottom: 15px;">
                                                                <span class="feature-icon" style="background-color: #667eea; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-size: 14px; font-weight: bold; margin-right: 12px; vertical-align: middle;">🔔</span>
                                                                <strong>Recevoir des notifications intelligentes</strong><br>
                                                                <span style="padding-left: 40px; display: inline-block;">Soyez alerté dès qu'un nouveau chapitre sort</span>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Feature 4 -->
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td class="feature-item" style="margin-bottom: 15px; font-size: 14px; color: #555555; line-height: 1.6; padding-bottom: 15px;">
                                                                <span class="feature-icon" style="background-color: #667eea; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-size: 14px; font-weight: bold; margin-right: 12px; vertical-align: middle;">⭐</span>
                                                                <strong>Partager vos avis avec la communauté</strong><br>
                                                                <span style="padding-left: 40px; display: inline-block;">Notez, commentez et échangez sur vos lectures favorites</span>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Feature 5 -->
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td class="feature-item" style="font-size: 14px; color: #555555; line-height: 1.6;">
                                                                <span class="feature-icon" style="background-color: #667eea; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-size: 14px; font-weight: bold; margin-right: 12px; vertical-align: middle;">🎯</span>
                                                                <strong>Découvrir de nouvelles pépites</strong><br>
                                                                <span style="padding-left: 40px; display: inline-block;">Explorez notre catalogue enrichi quotidiennement</span>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="button-section" style="text-align: center; padding: 30px 0;">
                                        <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${loginUrl}" style="height:50px;v-text-anchor:middle;width:250px;" arcsize="16%" stroke="f" fillcolor="#667eea">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">🚀 Accéder à mon compte</center>
                    </v:roundrect>
                    <![endif]-->
                                        <!--[if !mso]><!-->
                                        <a href="${loginUrl}" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                                            🚀 Accéder à mon compte
                                        </a>
                                        <!--<![endif]-->
                                    </td>
                                </tr>
                            </table>

                            <!-- Next Steps -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding: 0;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px; border-left: 4px solid #667eea;">
                                            <tr>
                                                <td style="padding: 25px;">
                                                    <p class="next-steps-title" style="font-size: 16px; font-weight: 600; color: #333333; margin: 0 0 15px 0;">
                                                        📝 Pour bien démarrer sur Scanverse
                                                    </p>

                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td class="next-steps-item" style="font-size: 14px; color: #555555; line-height: 1.6; padding: 0 0 10px 20px;">
                                                                → Personnalisez votre profil avec vos genres favoris
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="next-steps-item" style="font-size: 14px; color: #555555; line-height: 1.6; padding: 0 0 10px 20px;">
                                                                → Ajoutez vos premières lectures à votre bibliothèque
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="next-steps-item" style="font-size: 14px; color: #555555; line-height: 1.6; padding: 0 0 10px 20px;">
                                                                → Configurez vos préférences de notifications
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="next-steps-item" style="font-size: 14px; color: #555555; line-height: 1.6; padding: 0 0 0 20px;">
                                                                → Rejoignez la communauté et participez aux discussions
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

export default welcomeEmail;
