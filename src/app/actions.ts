"use server";

import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { transporter } from "@/utils/email";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
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

export interface SignUpInterface {
  error: {
    error: boolean;
    message: string;
  };
  userMail: null | string;
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

export async function handleSignUpSubmit(
  initialState: SignUpInterface,
  formData: FormData
) {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  if (
    !rawFormData.email ||
    !rawFormData.password ||
    !rawFormData.confirmPassword ||
    !rawFormData.name
  ) {
    return {
      error: {
        error: true,
        message: "Please provide All Requested Fields",
      },
      userMail: null,
    };
  }

  if (rawFormData.confirmPassword !== rawFormData.password) {
    return {
      error: {
        error: true,
        message: "Passwords aren't Identical",
      },
      userMail: null,
    };
  }
  await dbConnect();
  const uniqueString = generateRandomString();
  const newUser = await User.create({
    name: rawFormData.name,
    email: rawFormData.email,
    password: rawFormData.password,
    confirmPassword: rawFormData.confirmPassword,
    uniqueString,
  });
  // newUser.password = undefined;
  if (newUser) {
    //User created successfully but not validated, not to be validated by confirmation mail
    await sendMailConfirmation(
      rawFormData.email,
      rawFormData.name,
      uniqueString
    );
    return {
      error: {
        error: false,
        message: "",
      },
      userMail: rawFormData.email,
    };
  }

  // do the same logic as we have in handleSubmit MERN project ==> When the conditions are met then we create the new user and we redirect him to /account-confirmation/${inputData.email}
  console.log("form submitted with Form data : ", rawFormData);
}

export async function handleAddComment(initialState, formData: FormData) {
  const comment = formData.get("comment");
  const articleId = formData.get("articleId");
  if (articleId !== initialState.articleId) {
    return {
      ...initialState,
      status: "fail",
      message: "Cannot proceed with your request",
    };
  }
  const userID = await getCurrentUser();
  if (!userID) {
    return {
      ...initialState,
      status: "fail",
      message: "You are not allowed to comment! for Auth users only",
    };
  }

  if (!comment || comment.trim() === "") {
    return {
      ...initialState,
      status: "fail",
      message: "Bro wtf provide a comment don't send it empty!!!",
    };
  }

  const commentingUser = await User.findById(userID);
  const addCommentQuery = await Comment.create({
    content: comment.trim(),
    articleId,
    owner: userID,
    ownerName: commentingUser.name,
    ownerPicture: commentingUser.profilePicture,
  });

  if (!addCommentQuery) {
    return {
      ...initialState,
      status: "fail",
      message: "Cannot add the comment",
    };
  }
  revalidateTag("comments");

  return {
    ...initialState,
    status: "success",
    message: "commment added successfully",
  };
}

export async function getCurrentUser() {
  await dbConnect();
  const tokenCookies = await cookies();
  const token = tokenCookies.get("amineBlogv2")
    ? tokenCookies.get("amineBlogv2")?.value
    : null;
  if (!token || token === "loggedout") return null;

  const id = jwt.verify(token, process.env.SECRET_JWT_KEY).id;
  const checkUser = await User.findById(id);
  if (
    checkUser &&
    checkUser.name &&
    checkUser.name !== "" &&
    checkUser.isValid
  ) {
    return id;
  }
  return null;
}

export async function handleLikingArticle(articleId) {
  const id = await getCurrentUser();
  console.log("Liking received in the server side");
  if (!id) {
    return false;
  }

  const likingUser = await User.findById(id);
  if (likingUser.likedArticles.includes(articleId)) return false;
  const likedArticle = await Article.findById(articleId);
  likingUser.likedArticles.push(articleId);
  likedArticle.timesLiked++;
  if (!likingUser.confirmPassword) {
    likingUser.confirmPassword = likingUser.password;
  }
  await likingUser.save();
  await likedArticle.save();

  return true;
}

export async function checkArticleUserLikeStatus(articleId) {
  const id = await getCurrentUser();
  if (!id) {
    return false;
  }
  const userConcerned = await User.findById(id);
  if (!userConcerned) {
    return false;
  }

  if (!userConcerned.likedArticles.includes(articleId)) {
    return false;
  }

  return true;
}

export async function revalidateLikingNumber() {
  revalidateTag("likesNumber");
}

export async function addCommentLike(commentID) {
  const id = await getCurrentUser();
  if (!id) {
    return false;
  }
  const commentConcerned = await Comment.findById(commentID);
  if (commentConcerned.likedBy.includes(id)) return false;
  commentConcerned.likedBy.push(id);
  await commentConcerned.save();
  revalidateComments();
  return true;
}

export async function revalidateComments() {
  revalidateTag("comments");
}

export async function verifyAccount(mail, uniqueString) {
  await dbConnect();
  const unConfirmedUser = await User.findOne({ email: mail });
  if (!unConfirmedUser) {
    console.log("No user with that mail : ", mail);
    return null;
  }
  if (unConfirmedUser.isValid) {
    console.log("Account already valid : ", mail);
    return null;
  }

  if (uniqueString !== unConfirmedUser.uniqueString) {
    console.log("Does not Match the unique string you give : ", mail);
    return null;
  }

  unConfirmedUser.isValid = true;
  unConfirmedUser.confirmPassword = unConfirmedUser.password;
  await unConfirmedUser.save();
  (await cookies()).set({
    name: "amineBlogv2",
    value: signToken(unConfirmedUser._id),
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log("Account verified : ", mail);

  return {
    name: unConfirmedUser.name,
    email: unConfirmedUser.email,
    profilePicture: unConfirmedUser.profilePicture,
  };
}

export async function logOutAccount() {
  (await cookies()).set({
    name: "amineBlogv2",
    value: "loggedout",
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return true;
}

export async function deleteUserAccount() {
  const id = await getCurrentUser();
  if (!id) {
    return false;
  }
  await User.findByIdAndDelete(id);
  (await cookies()).set({
    name: "amineBlogv2",
    value: "loggedout",
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return true;
}

export async function handleForgotPasswordForm(
  initialState,
  formData: FormData
) {
  const email = formData.get("email");
  // find user + generate random token + sendResetMail
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user || !user.isValid) {
    return {
      error: {
        error: true,
        message: "User Not Found or not confirmed",
      },
      handled: false,
      email,
    };
  }

  // generate a random String 25
  const resetToken = generateRandomResetToken();
  user.passwordResetToken = signToken(resetToken);
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.confirmPassword = user.password;
  await user.save();

  await sendResetMail(email, resetToken);
  return {
    error: {
      error: false,
      message: "",
    },
    handled: true,
    email,
  };
}

export async function handleResetPasswordForm(
  initialState,
  formData: FormData
) {
  const email = formData.get("email");
  const token = formData.get("token");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  await dbConnect();
  const user = await User.findOne({ email });
  if (
    jwt.verify(user.passwordResetToken, process.env.SECRET_JWT_KEY).id === token
  ) {
    if (user.passwordResetExpires > Date.now()) {
      user.password = password;
      user.confirmPassword = confirmPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      (await cookies()).set({
        name: "amineBlogv2",
        value: signToken(user._id),
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      return {
        error: {
          error: false,
          message: "",
        },
        currentUser: {
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      };
    } else {
      return {
        error: {
          error: true,
          message: "Reset token is expired",
        },
        currentUser: null,
      };
    }
  }

  return {
    error: {
      error: true,
      message: "You are not allowed to reset the password",
    },
    currentUser: null,
  };
}

export async function handleOAuthCall(email, name, profilePicture) {
  await dbConnect();
  const validUser = await User.findOne({ email });
  if (validUser) {
    (await cookies()).set({
      name: "amineBlogv2",
      value: signToken(validUser._id),
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return {
      status: "success",
      data: {
        email,
        name,
        profilePicture: validUser.profilePicture,
      },
    };
  } else {
    const password = generateRandomPassword();
    const confirmPassword = password;
    const newUser = await User.create({
      name,
      email,
      profilePicture,
      password,
      confirmPassword,
      isValid: true,
    });
    (await cookies()).set({
      name: "amineBlogv2",
      value: signToken(newUser._id),
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      status: "success",
      data: {
        email,
        name,
        profilePicture,
      },
    };
  }
}

const generateRandomString = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const sendMailConfirmation = async (newUserMail, newUserName, uniqueString) => {
  const info = await transporter.sendMail({
    from: `${process.env.NODE_MAIL}`,
    to: newUserMail, // list of receivers
    subject: `Welcome ${newUserName}! (Email Adress Confirmation)`, // Subject line
    text: `unique String ${uniqueString}`, // plain text body
    html: `<h1>Welcome ${newUserName}</h1>
      <p>Please visit this link to confirm your account.<br/>Do not share this Link with anyone</p>
      <p>Your Unique String : </p>
      <p><samp>${uniqueString}</samp></p>
    `,
    // html: "<b>Hello world?</b>", // html body
  });
};

const generateRandomResetToken = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 25; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const sendResetMail = async (email, resetToken) => {
  const info = await transporter.sendMail({
    from: `${process.env.NODE_MAIL}`,
    to: email, // list of receivers
    subject: `Resetting Password `, // Subject line
    html: `<h1>Hello!</h1>
      <p>Please visit this link to reset your password.<br/>It is valid for only 1hour! Do not share this Link with anyone!!</p>
      <p>Here is your reset Token </br>${resetToken}</p>
      
    `,
  });
};

const generateRandomPassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};
