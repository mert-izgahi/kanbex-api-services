import mongoose, { Document } from "mongoose";
import { AuthProvider, Role, AccountStatus } from "../lib/enums";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IAccount extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  role: Role;
  provider: AuthProvider;
  status: AccountStatus;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  generateToken(): string;
}

export const accountSchema = new mongoose.Schema<IAccount>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: { type: String, required: true, default: Role.MEMBER },
    provider: { type: String, required: true, default: AuthProvider.CREDENTIALS },
    status: { type: String, required: true, default: AccountStatus.ACTIVE },
    imageUrl: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

accountSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

accountSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

accountSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const Account = mongoose.model<IAccount>("Account", accountSchema);
