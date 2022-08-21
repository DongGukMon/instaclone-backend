import client from "../client";
import jwt from "jsonwebtoken";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const protectedResolver =
  (ourResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const isQuery = info.operation.operation === "query";
      if (isQuery) {
        //seeFeed인지 확인하는 로직을 여기 포함시키는건 좋은 방법같지 않다. 어떻게 해야하는지는 아직 잘 모르겠다.
        if (info.fieldName === "seeFeed") {
          return [];
        }
        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
