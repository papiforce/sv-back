const welcomeEmail = (username: string, loginUrl: string) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compte activé avec succès</title>
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
    .welcome-text {
      font-size: 16px;
      line-height: 1.8;
      color: #333333;
      margin-bottom: 30px;
      text-align: center;
    }
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
      margin-bottom: 20px;
      text-align: center;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
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
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      margin-right: 12px;
      font-weight: bold;
    }
    .feature-item:last-child {
      margin-bottom: 0;
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
      margin-bottom: 15px;
    }
    .next-steps-list {
      list-style: none;
      padding: 0;
    }
    .next-steps-list li {
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 10px;
      padding-left: 25px;
      position: relative;
    }
    .next-steps-list li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #667eea;
      font-weight: bold;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #666666;
      line-height: 1.6;
    }
    .footer-links {
      margin: 20px 0;
    }
    .footer-link {
      color: #667eea;
      text-decoration: none;
      margin: 0 10px;
      font-weight: 500;
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
      <h1>🎉 Compte activé avec succès !</h1>
      <p>Bienvenue dans l'aventure Scanverse</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Success Badge -->
      <div class="success-badge">
        <div class="success-icon">✓</div>
      </div>

      <div class="welcome-text">
        <p>Félicitations <strong>${username}</strong> ! 🎊</p>
        <br>
        <p>
          Votre compte <strong>Scanverse</strong> est maintenant actif.<br>
          Vous pouvez dès à présent profiter de toutes nos fonctionnalités.
        </p>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <div class="features-title">✨ Ce que vous pouvez faire maintenant</div>
        
        <div class="feature-item">
          <div class="feature-icon">📚</div>
          <div>
            <strong>Explorer votre bibliothèque</strong><br>
            Ajoutez vos mangas et manhwas préférés à votre collection personnelle
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <div>
            <strong>Suivre vos lectures</strong><br>
            Gardez une trace de vos chapitres lus et de votre progression
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🔔</div>
          <div>
            <strong>Recevoir des notifications</strong><br>
            Ne manquez plus jamais la sortie d'un nouveau chapitre
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">⭐</div>
          <div>
            <strong>Noter et commenter</strong><br>
            Partagez votre avis sur vos lectures avec la communauté
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <div>
            <strong>Découvrir de nouveaux titres</strong><br>
            Explorez notre catalogue et trouvez votre prochaine lecture
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="button-section">
        <a href="${loginUrl}" class="cta-button">
          🚀 Accéder à mon compte
        </a>
      </div>

      <!-- Next Steps -->
      <div class="next-steps">
        <div class="next-steps-title">📝 Pour bien démarrer :</div>
        <ul class="next-steps-list">
          <li>Complétez votre profil avec vos genres préférés</li>
          <li>Ajoutez vos premiers mangas à votre bibliothèque</li>
          <li>Configurez vos préférences de notifications</li>
          <li>Rejoignez la communauté et découvrez les discussions</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>Scanverse</strong> - Votre compagnon manga & manhwa
      </p>

      <p style="margin-top: 20px; font-size: 12px; color: #999999;">
        Besoin d'aide ? Notre équipe est là pour vous :<br>
        <a href="mailto:support@scanverse.app" style="color: #667eea;">support@scanverse.app</a>
      </p>

      <p style="margin-top: 20px; font-size: 11px; color: #999999;">
        © ${new Date().getFullYear()} Scanverse. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
`;

export default welcomeEmail;
