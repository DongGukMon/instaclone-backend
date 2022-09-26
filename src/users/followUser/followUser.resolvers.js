import client from "../../client";
import { protectedResolver } from "../user.utils";

const followUserFn = async (_, { username }, { loggedInUser }) => {
  const ok = await client.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!ok) {
    return {
      ok: false,
      error: "That user dose not exist.",
    };
  }

  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        connect: {
          username,
        },
      },
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
      id: ok.id,
    };
  } else {
    return {
      ok: false,
      error: "Fail to follow user.",
    };
  }
};

export default {
  Mutation: {
    followUser: protectedResolver(followUserFn),
  },
};
