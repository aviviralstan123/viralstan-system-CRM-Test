export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
};

export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const wordCount = (text || '').split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const calculateWordCount = (text: string): number => {
  return (text || '').split(/\s+/).filter(Boolean).length;
};
