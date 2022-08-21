import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        let userId = 0;
        if (context.loggedInUser) {
          userId = context.loggedInUser.id;
        }
        const room = await client.room.findFirst({
          where: { id: args.id, users: { some: { id: userId } } },
        });

        if (!room) {
          throw new Error("You Shall not see this");
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
