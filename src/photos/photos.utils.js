export const processHashtags = (caption) => {
  const newHashtags = caption.match(/#[\w]+/g) || [];
  const hashArray = newHashtags.map((newHash) => ({
    where: { hashtag: newHash },
    create: { hashtag: newHash },
  }));
  return hashArray;
};
