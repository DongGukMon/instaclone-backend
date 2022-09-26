import client from "../../client";
import { protectedResolver } from "../../users/user.utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!photo) {
        return {
          ok: false,
          error: "Photo not found",
        };
      } else if (photo.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: "Not authorized",
        };
      } else {
        const comments = await client.comment.findMany({
          where: { photoId: id },
          select: { id: true },
        });
        const likes = await client.like.findMany({
          where: { photoId: id },
          select: { id: true },
        });

        Promise.all(
          comments.map(async (comment) => {
            await client.comment.delete({
              where: { id: comment?.id },
            });
          }),
          likes.map(async (like) => {
            await client.like.delete({
              where: { id: like?.id },
            });
          })
        ).then(
          async () =>
            await client.photo.delete({
              where: {
                id,
              },
            })
        );

        return {
          ok: true,
        };
      }
    }),
  },
};
