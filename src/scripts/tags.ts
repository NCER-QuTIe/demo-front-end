export const tagCategories = [
  "subject",
  "grade",
  "cognitive",
  "content",
  "tag",
];

export const tagLabels = {
  content: "შინაარსობრივი სფერო",
  cognitive: "კოგნიტური სფერო",
  grade: "კლასი",
  subject: "საგანი",
  tag: "კვლევა",
};

type Tags = {
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
  let res = {};

  for (let category of tagCategories) {
    res[category] = tags
      .filter((e) => e.startsWith(category + "-"))
      .map((e) => e.slice(category.length + 1));
  }

  return res as Tags;
}

export function tagsObjectToList(tags: Tags): string[] {
  let res = [];

  for (let category of tagCategories) {
    for (let tag of tags[category]) {
      res.push(category + "-" + tag);
    }
  }

  return res;
}
