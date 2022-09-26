import client from "../client";

export default {
  User: {
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const followCheck = await client.user
        .findUnique({ where: { id: loggedInUser.id } })
        .following({
          where: { id },
          select: { id: true },
        });

      return Boolean(followCheck.length);
    },
    isMe: ({ id }, _, { loggedInUser }) => {
      //seeProfile의 username을 잘못입력하면 애초에 User 자체를 반환하지 않으니, User의 Computed Fields인 isMe를 resolve 시도조차 하지 않는다.
      //username을 막 입력하면 console.log(loggedInUser가 찍히지 않는 이유)
      return id === loggedInUser?.id;
    },
    //아래 두가지 방법 중 뭐가 더 나은 방법인지 나중에 알아보자!
    totalFollowing: async ({ id }) => {
      const totalFollowing = await client.user
        .findUnique({
          where: { id },
        })
        .following({
          select: { id: true },
        });

      return totalFollowing.length;

      //   return totalFollowers;
    },
    totalFollowers: async ({ id }) =>
      client.user.count({
        where: { following: { some: { id } } },
      }),
    photos: ({ id }, { page }) =>
      client.user.findUnique({ where: { id } }).photos({
        take: 30,
        skip: (page - 1) * 5,
      }),
    rooms: async ({ id }) =>
      client.room.findMany({
        where: { users: { some: { id } } },
        select: { id: true },
      }),
    totalPhotos: async ({ id }) => {
      const count = await client.photo.count({
        where: { user: { id } },
      });

      return count;
    },
  },
};
