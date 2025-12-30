import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JWTUtils } from "@/utils/jwt";

// ====================================
// ENUMS
// ====================================
export enum UserRole {
  FOUNDER = "FOUNDER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  MEMBER = "MEMBER",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

// ====================================
// INTERFACES
// ====================================
export interface IRefreshToken {
  token: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: UserRole[];
  profilePicture?: string;
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  referralCount: number;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  refreshTokens: IRefreshToken[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginCount: number;
  lastLoginAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Méthodes
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateReferralCode(): string;
  generateEmailVerificationToken(token: string): string;
  generatePasswordResetToken(): string;
  addRefreshToken(
    token: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;
  removeRefreshToken(token: string): Promise<void>;
  markAsDeleted(): Promise<void>;
  verifyEmail(): Promise<void>;
  incrementLoginCount(): Promise<void>;
}

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string, select?: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByReferralCode(code: string): Promise<IUser | null>;
  findActiveUsers(filters?: Record<string, any>): Promise<IUser[]>;
  generateUniqueReferralCode(): Promise<string>;
}

// ====================================
// SCHEMA
// ====================================
const UserSchema = new Schema<IUser, IUserModel>(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      unique: true,
      trim: true,
      minlength: [
        3,
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      ],
      maxlength: [
        30,
        "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
      ],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores",
      ],
      index: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Veuillez fournir un email valide"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false, // Ne pas retourner le password par défaut
    },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.MEMBER],
      validate: {
        validator: function (roles: UserRole[]) {
          return roles.length > 0;
        },
        message: "Un utilisateur doit avoir au moins un rôle",
      },
    },
    profilePicture: {
      type: String,
      default: null,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        "URL de l'image de profil invalide",
      ],
    },
    referralCode: {
      type: String,
      required: false,
      uppercase: true,
      length: 6,
      match: [/^[A-Z0-9]{6}$/, "Code de parrainage invalide"],
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referralCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING_VERIFICATION,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerifiedAt: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    refreshTokens: {
      type: [
        {
          token: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          expiresAt: {
            type: Date,
            required: true,
          },
          ipAddress: { type: String },
          userAgent: { type: String },
        },
      ],
      default: [],
      select: false,
      validate: {
        validator: function (tokens: IRefreshToken[]) {
          return tokens.length <= 5; // Max 5 sessions simultanées
        },
        message: "Nombre maximum de sessions atteint",
      },
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    loginCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true, // Index pour les stats
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ====================================
// INDEXES
// ====================================
UserSchema.index({ email: 1, accountStatus: 1 });
UserSchema.index({ username: 1, accountStatus: 1 });
UserSchema.index({ referralCode: 1 }, { unique: true });
UserSchema.index({ referredBy: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ deletedAt: 1 }, { sparse: true });
UserSchema.index({ loginCount: -1 });
UserSchema.index({ lastLoginAt: -1 });

// ====================================
// MIDDLEWARES - PRE SAVE
// ====================================
UserSchema.pre("save", async function (next) {
  // Hash du mot de passe si modifié
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Générer un code de parrainage si nouveau user
  if (this.isNew && !this.referralCode) {
    const isInWaitlist = await this.model("Waitlist").exists({
      email: this.email,
    });

    if (isInWaitlist) {
      this.referralCode = await (
        this.constructor as IUserModel
      ).generateUniqueReferralCode();
    } else {
      this.referralCode = undefined;
    }
  }

  next();
});

// Incrémenter le compteur de parrainage du parrain
UserSchema.pre("save", async function (next) {
  if (this.isNew && this.referredBy) {
    try {
      await this.model("User").findByIdAndUpdate(this.referredBy, {
        $inc: { referralCount: 1 },
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'incrémentation du compteur de parrainage:",
        error
      );
    }
  }
  next();
});

// ====================================
// MIDDLEWARES - PRE FIND
// ====================================
// Exclure les comptes supprimés par défaut
UserSchema.pre(/^find/, function (next) {
  const query = this as any;

  // Ne pas filtrer si on cherche explicitement les comptes supprimés
  if (!query.getQuery().deletedAt) {
    query.where({ deletedAt: null });
  }

  next();
});

// ====================================
// MÉTHODES D'INSTANCE
// ====================================

// Comparer le mot de passe
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Erreur lors de la comparaison du mot de passe");
  }
};

// Générer un code de parrainage
UserSchema.methods.generateReferralCode = function (): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

// Générer un token de vérification d'email
UserSchema.methods.generateEmailVerificationToken = function (
  token: string
): string {
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  return token;
};

// Générer un token de réinitialisation de mot de passe
UserSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  return token;
};

// Ajouter un refresh token
UserSchema.methods.addRefreshToken = async function (
  token: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  // Limiter à 5 tokens (5 sessions max)
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens.shift(); // Supprimer le plus ancien
  }

  this.refreshTokens.push({
    token,
    createdAt: new Date(),
    expiresAt: JWTUtils.getRefreshTokenExpiration(),
    ipAddress,
    userAgent,
  });
  await this.save({ validateBeforeSave: false });
};

// Supprimer un refresh token
UserSchema.methods.removeRefreshToken = async function (
  token: string
): Promise<void> {
  this.refreshTokens = this.refreshTokens.filter(
    (t: IRefreshToken) => t.token !== token
  );
  await this.save({ validateBeforeSave: false });
};

// Marquer comme supprimé (soft delete)
UserSchema.methods.markAsDeleted = async function (): Promise<void> {
  this.deletedAt = new Date();
  this.accountStatus = AccountStatus.DELETED;
  this.refreshTokens = [];
  await this.save({ validateBeforeSave: false });
};

// Vérifier l'email
UserSchema.methods.verifyEmail = async function (): Promise<void> {
  this.emailVerified = true;
  this.emailVerifiedAt = new Date();
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
  this.accountStatus = AccountStatus.ACTIVE;
  await this.save({ validateBeforeSave: false });
};

UserSchema.methods.incrementLoginCount = async function (): Promise<void> {
  this.loginCount += 1;
  this.lastLoginAt = new Date();
  await this.save({ validateBeforeSave: false });
};

// ====================================
// MÉTHODES STATIQUES
// ====================================

// Trouver par email
UserSchema.statics.findByEmail = async function (
  email: string,
  select?: string
): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase() }).select(select || "");
};

// Trouver par username
UserSchema.statics.findByUsername = async function (
  username: string
): Promise<IUser | null> {
  return this.findOne({ username: username.toLowerCase() });
};

// Trouver par code de parrainage
UserSchema.statics.findByReferralCode = async function (
  code: string
): Promise<IUser | null> {
  return this.findOne({ referralCode: code.toUpperCase() });
};

// Trouver les utilisateurs actifs
UserSchema.statics.findActiveUsers = async function (
  filters: Record<string, any> = {}
): Promise<IUser[]> {
  return this.find({
    accountStatus: AccountStatus.ACTIVE,
    emailVerified: true,
    ...filters,
  });
};

// Générer un code de parrainage unique
UserSchema.statics.generateUniqueReferralCode =
  async function (): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code: string;
    let exists: boolean;

    do {
      code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await this.findOne({ referralCode: code });
      exists = !!existing;
    } while (exists);

    return code;
  };

const UserModel = mongoose.model<IUser, IUserModel>("User", UserSchema);

export default UserModel;
