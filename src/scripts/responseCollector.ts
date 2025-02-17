import { type TestResponse, TestResponseBundle } from "./types.d.ts";

const localStorageKey = "test-responses" as const;

export function saveTestResponse(testResponse: TestResponse) {
  const obj = JSON.parse(
    localStorage.getItem(localStorageKey) || "[]",
  ) as TestResponse[];

  obj.push(testResponse);

  localStorage.setItem(localStorageKey, JSON.stringify(obj));
}

export function getSavedTestResponseList(): TestResponse[] {
  const obj = JSON.parse(
    localStorage.getItem(localStorageKey) || "[]",
  ) as TestResponse[];

  const reducedObj: TestResponse[] = [];

  for (const { testID, testName, startTimeEpoch, endTimeEpoch } of obj) {
    reducedObj.push({
      testID,
      testName,
      startTimeEpoch,
      endTimeEpoch,
    });
  }

  return reducedObj;
}

export function deleteTestResponse(id: string) {
  const obj = JSON.parse(
    localStorage.getItem(localStorageKey) || "[]",
  ) as TestResponse[];

  for (let i = 0; i < obj.length; i++) {
    if (obj[i].testID === id) {
      obj.splice(i, 1);
      console.log("deleted", i, "test");
      break;
    }
  }

  localStorage.setItem(localStorageKey, JSON.stringify(obj));
}

export function deleteAllTestResponses() {
  localStorage.setItem(localStorageKey, "[]");
}

export function getSavedTestResponseBundle(
  studentName: string,
): TestResponseBundle {
  const testResponses = JSON.parse(
    localStorage.getItem(localStorageKey) || "[]",
  ) as TestResponse[];

  return {
    studentName,
    testResponses,
  };
}
