"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface SignInInterface {
  error: {
    error: boolean;
    message: string;
  };
  currentUser: null | {
    email: string;
    name: string;
    profilePicture: string;
  };
}

interface formDataInterface {
  email: string;
  name: string;
}

const signToken = (id: string) => {
  return jwt.sign({ id: id }, process.env.SECRET_JWT_KEY);
};

export async function handleSignInSubmit(
  initialState: SignInInterface,
  formData: FormData
) {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!rawFormData.email || !rawFormData.password) {
    return {
      error: {
        error: true,
        message: "Please provide email and password",
      },
      currentUser: null,
    };
  }

  await dbConnect();

  const userImpacted = await User.findOne({ email: rawFormData.email });
  if (!userImpacted || !userImpacted.isValid) {
    return {
      error: {
        error: true,
        message: "User Not Found or not confirmed",
      },
      currentUser: null,
    };
  }

  const validPassword = bcrypt.compareSync(
    rawFormData.password,
    userImpacted.password
  );
  if (!validPassword) {
    return {
      error: {
        error: true,
        message: "email or password is invalid",
      },
      currentUser: null,
    };
  }

  //   userImpacted.password = undefined

  // Send cookies token
  (await cookies()).set({
    name: "amineBlogv2",
    value: signToken(userImpacted._id),
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    error: {
      error: false,
      message: "",
    },
    currentUser: {
      name: userImpacted.name,
      email: userImpacted.email,
      profilePicture: userImpacted.profilePicture,
    },
  };
}

export async function handleSignUpSubmit(formData: FormData) {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // do the same logic as we have in handleSubmit MERN project ==> When the conditions are met then we create the new user and we redirect him to /account-confirmation/${inputData.email}
  console.log("form submitted with Form data : ", rawFormData);
}
