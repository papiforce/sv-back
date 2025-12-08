const waitlistEmail = (email: string, code: string, url: string) => `
  <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Scanverse</title>
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
    .code-section {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      border: 2px dashed #667eea;
    }
    .code-label {
      font-size: 14px;
      color: #666666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .code {
      font-size: 42px;
      font-weight: 700;
      color: #667eea;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      margin: 10px 0;
      user-select: all;
    }
    .code-description {
      font-size: 13px;
      color: #666666;
      margin-top: 15px;
      line-height: 1.6;
    }
    .benefits-section {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 25px;
      margin: 30px 0;
    }
    .benefits-title {
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 15px;
      text-align: center;
    }
    .benefit-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
    }
    .benefit-icon {
      background-color: #667eea;
      color: #ffffff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;
      font-weight: 700;
      font-size: 14px;
    }
    .reward-highlight {
      background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
      border-left: 4px solid #fdcb6e;
    }
    .reward-title {
      font-size: 16px;
      font-weight: 700;
      color: #333333;
      margin-bottom: 8px;
    }
    .reward-text {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .info-box {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      padding: 15px;
      margin: 25px 0;
      font-size: 13px;
      color: #555555;
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
    .footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
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
      .code {
        font-size: 32px;
        letter-spacing: 4px;
      }
      .code-section {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>🎉 Bienvenue sur Scanverse !</h1>
      <p>Vous faites désormais partie de l'aventure</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="welcome-text">
        <p>Bonjour,</p>
        <br>
        <p>
          Merci de vous être inscrit à la liste d'attente de <strong>Scanverse</strong>, 
          votre future application de suivi de mangas, manhwas et bien plus encore !
        </p>
        <br>
        <p>
          Vous serez parmi les premiers informés du lancement officiel et pourrez 
          profiter d'un accès anticipé à la plateforme.
        </p>
      </div>

      <!-- Code de parrainage -->
      <div class="code-section">
        <div class="code-label">Votre Code de Parrainage</div>
        <div class="code">${code}</div>
        <div class="code-description">
          <strong>⚠️ Conservez précieusement ce code !</strong><br>
          Vous le retrouverez sur votre profil après votre inscription à Scanverse.
        </div>
      </div>

      <!-- Reward Highlight -->
      <div class="reward-highlight">
        <div class="reward-title">🎁 Gagnez 1 mois d'abonnement Passionné offert !</div>
        <div class="reward-text">
          Partagez votre code avec vos amis. Dès que <strong>3 personnes</strong> 
          s'inscrivent avec votre code et souscrivent à un abonnement, 
          vous recevez <strong>1 mois d'abonnement Passionné gratuit</strong> !
        </div>
      </div>

      <!-- Comment ça marche -->
      <div class="benefits-section">
        <div class="benefits-title">📋 Comment ça marche ?</div>
        
        <div class="benefit-item">
          <div class="benefit-icon">1</div>
          <div>
            <strong>Partagez votre code</strong> avec vos amis passionnés de mangas/manhwas
          </div>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">2</div>
          <div>
            Ils s'inscrivent au lancement de Scanverse avec <strong>votre code de parrainage</strong>
          </div>
        </div>

        <div class="benefit-item">
          <div class="benefit-icon">3</div>
          <div>
            Dès que <strong>3 filleuls souscrivent</strong> à un abonnement, 
            vous recevez <strong>1 mois offert</strong> ! 🎉
          </div>
        </div>
      </div>

      <!-- Info importante -->
      <div class="info-box">
        <strong>💡 Important :</strong> Pour que le code soit lié à votre profil, 
        vous devrez vous inscrire à la sortie du projet avec cette adresse email : 
        <strong>${email}</strong>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>Scanverse</strong> - Votre compagnon manga & manhwa
      </p>
      
      <div class="social-links">
        <a href="https://discord.gg/scanverse">Discord</a> •
        <a href="https://twitter.com/scanverse">Twitter</a> •
        <a href="${url}">Site Web</a>
      </div>

      <p style="margin-top: 15px; font-size: 11px; color: #999999;">
        © ${new Date().getFullYear()} Scanverse. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>

`;

export default waitlistEmail;
