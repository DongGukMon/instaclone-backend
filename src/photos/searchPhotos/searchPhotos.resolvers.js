import client from "../../client";
export default {
  Query: {
    searchPhotos: (_, { keyword, page }) =>
      client.photo.findMany({
        where: {
          caption: {
            contains: keyword.toLowerCase(),
          },
        },
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};
