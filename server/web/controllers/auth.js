import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

import Admin from "../model/Admin.js";

export const signup = async (ctx) => {
  const { name, email, password, role } = ctx.request.body;

  try {
    const oldUser = await Admin.findOne({ email });

    if (oldUser) {
      ctx.status = 400;
      ctx.body = { message: "User already exists" };
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await Admin.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      config.secret_key,
      {
        expiresIn: "48h",
      }
    );

    const user = {
      _id: result._id,
      email: result.email,
      role: result.role,
    };

    ctx.status = 201;
    ctx.body = {
      status: 201,
      message: "User register successfully!",
      result: user,
      token: token,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Something went wrong" };
    console.log(error);
  }
};

export const signin = async (ctx) => {
  try {
    const { email, password } = ctx.request.body;

    const oldUser = await Admin.findOne({ email });

    if (!oldUser) {
      ctx.status = 404;
      ctx.body = { message: "User doesn't exist" };
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      ctx.status = 400;
      ctx.body = { message: "Invalid credentials" };
      return;
    }

    const token = jwt.sign({ id: oldUser._id }, config.secret_key, {
      expiresIn: "148h",
    });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: "User login successfully!",
      token: token,
      user: {
        name: oldUser.name,
        email: oldUser.email,
      },
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: "Internal server error!",
      error: err,
    };
  }
};
