import client from "../../client";
import { protectedResolver } from "../../users/user.utils";

export default {
  Query: {
    seeFeed: protectedResolver(async (_, __, { loggedInUser }) => {
      const photos = await client.photo.findMany({
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
