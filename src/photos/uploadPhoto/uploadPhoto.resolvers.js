import client from "../../client";
import { processHashtags } from "../photos.utils";
import { protectedResolver } from "../../users/user.utils";
export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashArray = [];
        if (caption) {
          hashArray = processHashtags(caption);
        }

        await client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(Boolean(hashArray.length) && {
              hashtags: { connectOrCreate: hashArray },
            }),
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
