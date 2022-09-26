import client from "../client";
import { protectedResolver } from "../users/user.utils";

export default {
  Message: {
    user: ({ userId }) =>
      client.user.findUnique({
        where: { id: userId },
      }),
  },
  Room: {
    users: async ({ id }) => {
      const users = await client.room
        .findUnique({
          where: { id },
        })
        .users();
      return users;
    },
    messages: async ({ id }) => {
      const messages = await client.message.findMany({
        where: { roomId: id },
        orderBy: { createdAt: "asc" },
      });

      return messages;
    },
    unreadTotal: ({ id }, __, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      } else {
        return client.message.count({
          where: {
            roomId: id,
            read: false,
            user: {
              id: {
                not: loggedInUser.id,
              },
            },
          },
        });
      }
    },
  },
};
