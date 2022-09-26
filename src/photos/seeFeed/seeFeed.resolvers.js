import client from "../../client";
import { protectedResolver } from "../../users/user.utils";

export default {
  Query: {
    seeFeed: protectedResolver(async (_, { lastId }, { loggedInUser }) => {
      const photos = await client.photo.findMany({
        take: 2,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            { userId: loggedInUser.id },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return photos;
    }),
  },
};
