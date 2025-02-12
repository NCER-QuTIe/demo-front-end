import { Item, ItemInfo, Tags } from "./types.d.ts";

export const tagCategories = [
  "subject",
  "grade",
  "research",
  "content",
  "cognitive",
  "language",
] as const;

export const tagLabels = {
  content: "შინაარსობრივი სფერო",
  cognitive: "კოგნიტური სფერო",
  grade: "კლასი",
  subject: "საგანი/სფერო",
  research: "კვლევა",
  language: "ენა",
};

export const tagColors = {
  subject: {
    "მათემატიკა": "#117983",
    "ბუნებისმეტყველება": "#F9B621",
    "კითხვა": "#e4423c",
  },
  content: {},
  cognitive: {},
  grade: {},
  research: {},
  language: {},
};

export function emptyTagsObject(): Tags {
  const res: any = {};
  for (const category of tagCategories) {
    res[category] = [];
  }
  return res as Tags;
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

export function tagsListToItemInfo(tags: string[]): ItemInfo {
  const itemInfo: ItemInfo = {};

  for (const tag of tags) {
    const found = tag.match(
      /^#(?<itemIndex>\d+)-(?<category>\w+)-(?<value>.+)/,
    );

    console.log(found);
    if (found && found.groups) {
      const { itemIndex, category, value } = found.groups;
      const index = Number(itemIndex);

      if (!itemInfo[index]) {
        itemInfo[index] = {};
      }
      itemInfo[index][category] = value;
    }
  }

  return itemInfo;
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
