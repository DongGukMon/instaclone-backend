import client from "../../client";
import { protectedResolver } from "../../users/user.utils";
import { processHashtags } from "../photos.utils";
export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const oldPhoto = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          include: { hashtags: { select: { hashtag: true } } },
        });

        if (!oldPhoto) {
          return {
            ok: false,
            error: "Photo not found",
          };
        }

        const updatedPhoto = await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });

        if (updatedPhoto.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Could not update photo.",
          };
        }
      }
    ),
  },
};
