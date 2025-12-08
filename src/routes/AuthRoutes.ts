import { Router } from "express";

import { passport } from "../config";

import { authenticateToken } from "../middlewares";
import { AuthController } from "../controllers";

const router = Router();

router.get("/discord", passport.authenticate("discord"));
router.get(
  "/discord/callback",
  passport.authenticate("discord", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=discord_auth_failed`,
  }),
  AuthController.discordSignIn
);
router.get(
  "/discord/link",
  authenticateToken,
  passport.authenticate("discord", {
    session: false,
    state: "link_account",
  })
);
router.get(
  "/discord/link/callback",
  passport.authenticate("discord", { session: false }),
  AuthController.discordLinkCallback
);

router.get("/me", authenticateToken, AuthController.loggedUser);

router.post("/sign-up", AuthController.signUp);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verification", AuthController.resendVerificationEmail);

router.post("/sign-in", AuthController.signIn);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.refreshToken);

router.post("/discord/unlink", authenticateToken, AuthController.unlinkDiscord);

export default router;
