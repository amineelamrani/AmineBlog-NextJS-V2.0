import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface Users extends mongoose.Document {
  name: string;
  email: string;
  profilePicture: string;
  admin: boolean;
  likedArticles?: mongoose.Schema.Types.ObjectId[];
  password: string;
  confirmPassword: string | undefined;
  isValid: boolean;
  uniqueString?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
}

const userSchema = new mongoose.Schema<Users>(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    profilePicture: {
      type: String,
      default: "/defaultLogo.png",
    },
    admin: {
      type: Boolean,
      default: false,
    },
    likedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: 8,
      //   select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    uniqueString: {
      type: String,
    },
    passwordResetToken: String,
    passwordResetExpires: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // when creating a new password or modifying it we will hash it before save
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const User: mongoose.Model<Users> =
  mongoose.models.User || mongoose.model<Users>("User", userSchema);
export default User;
