import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/user.utils";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, userId, roomId }, { loggedInUser }) => {
        let room = null;

        if (userId) {
          const user = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!user) {
            return {
              ok: false,
              error: "User not found",
            };
          }
          room = await client.room.create({
            data: {
              users: {
                connect: [
                  {
                    id: loggedInUser.id,
                  },
                  {
                    id: userId,
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: { id: true },
          });
          if (!room) {
            return {
              ok: false,
              error: "Room not found",
            };
          }
        }

        const message = await client.message.create({
          data: {
            room: {
              connect: {
                id: room.id,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            payload,
          },
        });

        pubsub.publish(NEW_MESSAGE, { roomUpdates: message });

        return {
          ok: true,
          id: message.id,
          roomId: room.id,
        };
      }
    ),
  },
};
