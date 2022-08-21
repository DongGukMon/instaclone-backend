import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findUnique({
          where: { id: args.id },
        });
        if (!room) {
          throw new Error("Room not found");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomUpdates }, { id }) => {
            //(payload, variables) => {} 형태
            //payload는 roomUpdates의 return 값. 이경우는 Message
            //variables는 roomUpdate의 args. 이경우는 id (roomId)가 된다
            return roomUpdates.roomId === id;
          }
        )(root, args, context, info);
      },
    },
  },
};
