import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      //유효성 검사
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "User not found.",
        };
      }

      const PAGE_LENGTH = 5;

      //페이지에 노출할 팔로워
      const aFollowers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: PAGE_LENGTH,
          skip: (page - 1) * PAGE_LENGTH,
        });
      //전체 페이지 수 계산을 위해 팔로워 숫자 count
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });

      return {
        ok: true,
        followers: aFollowers,
        totalPages: Math.ceil(totalFollowers / PAGE_LENGTH),
      };
    },
  },
};
