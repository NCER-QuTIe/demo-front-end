export const tagCategories = [
  "subject",
  "grade",
  "tag",
  "content",
  "cognitive",
] as const;

export const tagLabels = {
  content: "შინაარსობრივი სფერო",
  cognitive: "კოგნიტური სფერო",
  grade: "კლასი",
  subject: "საგანი",
  tag: "კვლევა",
};

export const tagColors = {
  subject: {
    "მათემატიკა": "#117983",
    "ბუნებისმეტყველება": "#F9B621",
  },
  content: {},
  cognitive: {},
  grade: {},
  tag: {},
};

export type Tags = {
  content: string[];
  cognitive: string[];
  grade: string[];
  subject: string[];
  tag: string[];
};

export function emptyTagsObject(): Tags {
  return {
    content: [],
    cognitive: [],
    grade: [],
    subject: [],
    tag: [],
  };
}

export function tagsListToObject(tags: string[]): Tags {
  const res: Tags = emptyTagsObject();

  for (const category of tagCategories) {
    res[category] = tags
      .filter((e) => e.startsWith(category + "-"))
      .map((e) => e.slice(category.length + 1));
  }

  return res as Tags;
}

export function tagsObjectToList(tags: Tags): string[] {
  const res = [];

  for (const category of tagCategories) {
    for (const tag of tags[category]) {
      res.push(category + "-" + tag);
    }
  }

  return res;
}
