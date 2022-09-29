import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword, lastId }) =>
      client.user.findMany({
        where: {
          username: {
            contains: keyword.toLowerCase(),
          },
        },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};
