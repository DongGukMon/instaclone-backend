import client from "../client";

export default {
  Photo: {
    comments: ({ id }) =>
      client.comment.count({
        where: {
          photoId: id,
        },
      }),
    isMine: ({ userId }, __, { loggedInUser }) => {
      return userId === loggedInUser?.id;
    },
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      // client.photo.findUnique({ where: { id } }).hashtags(),
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    likes: ({ id }) =>
      client.like.count({
        where: {
          photoId: id,
        },
      }),
  },
  Hashtag: {
    photos: ({ id }, { page }) =>
      client.hashtag.findUnique({ where: { id } }).photos({
        take: 5,
        skip: (page - 1) * 5,
      }),
    totalPages: async ({ id }) => {
      const totalPhotos = await client.photo.count({
        where: { hashtags: { some: { id } } },
      });
      console.log(totalPhotos);
      return Math.ceil(totalPhotos / 5);
    },
    totalPhotos: ({ id }) =>
      client.photo.count({ where: { hashtags: { some: { id } } } }),
  },
};
