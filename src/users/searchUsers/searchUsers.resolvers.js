import client from "../../client";

export default {
  Query: {
    //cursor를 id로 하면 검색할 때 좀 애매해지는데... 이부분 어케해결하지
    searchUsers: async (_, { keyword, lastId }) =>
      client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};
