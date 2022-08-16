import client from "../client";

export default {
  Photo: {
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
