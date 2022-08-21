import client from "../client";

export default {
  Comment: {
    isMine: ({ userId }, __, { loggedInUser }) => {
      return userId === loggedInUser?.id;
    },
  },
};
