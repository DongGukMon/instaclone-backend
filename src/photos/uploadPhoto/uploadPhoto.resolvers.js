import client from "../../client";
import { processHashtags } from "../photos.utils";
import { protectedResolver } from "../../users/user.utils";
import { uploadToS3 } from "../../shared/shared.utils";
export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashArray = [];
        if (caption) {
          hashArray = processHashtags(caption);
        }

        const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");

        const photo = await client.photo.create({
          data: {
            file: fileUrl,
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
        return photo;
      }
    ),
  },
};
