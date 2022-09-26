import client from "../../client";
import { protectedResolver } from "../user.utils";

const unfollowUserFn = async (_, { username }, { loggedInUser }) => {
  const ok = await client.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!ok) {
    return {
      ok: false,
      error: "Can't unfollow user.",
    };
  }

  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        disconnect: {
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
      error: "Fail to unfollow user.",
    };
  }
};

export default {
  Mutation: {
    unfollowUser: protectedResolver(unfollowUserFn),
  },
};
