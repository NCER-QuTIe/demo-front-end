export type Tags = {
  [category: string]: string[];
};

// The attributes come from QTI, I don't know which
// are necessary and which not.
export type Item = {
  guid: string;
  partIdentifier: string;
  sectionIdentifier: string;
  identifier: string;
  fixed: string;
  required: string;
  href: string;
  category: string;
  sessionControl: string;
  timeLimits: string;
  xml: string;
};

export type ItemInfo = { [itemNumber: number]: { [category: string]: string } };

export type Test = {
  name: string;
  description: string;
  tags: Tags;
  status: boolean; // visibility status
  itemInfo: ItemInfo;
  id?: string;
  kind: "qti" | "external";
};

export type TestWithURL = {
  test: Test;
  url: string;
};

export type TestWithPackage = {
  test: Test;
  packageBase64: string;
};

export type ItemResponse = {
  itemNumber?: number;
  itemIdentifier: string;
  interactionResponses: { [key: string]: string };
  durationSeconds: number;
  points: {
    received: number;
    maximal: number;
  };
};

export type TestResponse = {
  testID: string;
  testName: string;
  startTimeEpoch: number;
  endTimeEpoch: number;
  itemResponses?: ItemResponse[];
};

export type TestResponseBundle = {
  studentName: string;
  testResponses: TestResponse[];
};
