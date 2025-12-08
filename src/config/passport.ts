import passport from "passport";
import { Strategy as DiscordStrategy, Profile } from "passport-discord";
import { User } from "../models";

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_CALLBACK_URL } =
  process.env;

passport.use(
  new DiscordStrategy(
    {
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      callbackURL: DISCORD_CALLBACK_URL,
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        let user = await User.findOne({ discordId: profile.id });

        const discordProfilePicture = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;

        if (user) {
          user.discordUsername = profile.username;
          user.discordDiscriminator = profile.discriminator;
          user.profilePicture = profile.avatar ? discordProfilePicture : null;
          user.isEmailVerified = true;

          await user.save();

          return done(null, user);
        }

        if (profile.email) {
          user = await User.findOne({ email: profile.email });

          if (user) {
            user.discordId = profile.id;
            user.discordUsername = profile.username;
            user.discordDiscriminator = profile.discriminator;
            user.profilePicture = profile.avatar ? discordProfilePicture : null;
            user.authProvider = "DISCORD";
            user.isEmailVerified = true;

            await user.save();

            return done(null, user);
          }
        }

        const newUser = await User.create({
          username: profile.username || `discord_${profile.id}`,
          email: profile.email || `${profile.id}@discord.placeholder`,
          discordId: profile.id,
          discordUsername: profile.username,
          discordDiscriminator: profile.discriminator,
          authProvider: "DISCORD",
          roles: ["MEMBER"],
          isEmailVerified: true,
          profilePicture: profile.avatar ? discordProfilePicture : null,
          password: null,
        });

        done(null, newUser);
      } catch (error) {
        console.error("❌ Erreur Discord strategy:", error);

        done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
