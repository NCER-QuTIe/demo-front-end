// @ts-types="npm:vite/types/importMeta.d.ts";
import { itemInfoLabels } from "./itemInfo.ts";
import {
  tagsListToItemInfo,
  tagsListToObject,
  tagsObjectToList,
} from "./tags.ts";
import {
  Tags,
  Test,
  TestResponseBundle,
  TestWithPackage,
  TestWithURL,
} from "./types.d.ts";

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  const auth = btoa(`${username}:${password}`);

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/login`,
    {
      headers: {
        "Authorization": `Basic ${auth}`,
      },
    },
  );

  if (res.ok) {
    window.localStorage.setItem("credidentials", auth);

    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage(
        auth,
      );
    });
  }

  return res.ok;
}

export function getAuth(): string | null {
  if (window) {
    return window.localStorage.getItem("credidentials");
  }
  return null;
}

export async function putFeedback(
  email: string,
  message: string,
): Promise<Response> {
  const obj = {
    email,
    message,
  };

  const auth = getAuth();

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/feedback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth ? `Basic ${auth}` : "",
      },
      body: JSON.stringify(obj),
    },
  );

  return res;
}

export type Feedback = {
  message: string;
  email?: string;
  id: string;
  uploaded: string;
};
export async function getFeedbackList(): Promise<Feedback[]> {
  const auth = getAuth();

  if (!auth) {
    throw new Error(
      "to get the list of all feedbacks, the user needs to be authenticated",
    );
  }

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/feedbacks`,
    {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const json = await res.json();

  json.sort((a: any, b: any): number => {
    // Convert the string dates to Date objects for comparison
    const dateA = new Date(a.uploaded);
    const dateB = new Date(b.uploaded);

    // Compare the dates (ascending order)
    return dateA.getTime() - dateB.getTime();
  });

  return json as Feedback[];
}

export async function deleteFeedbackWithID(id: string) {
  const auth = getAuth();

  if (!auth) {
    throw new Error(
      "to get the list of all feedbacks, the user needs to be authenticated",
    );
  }

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/feedback/${id}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Basic ${auth}`,
      },
    },
  );

  return res;
}

export async function putTestResponse(
  emailAddress: string,
  testResponseBundle: TestResponseBundle,
): Promise<Response> {
  const url = `${import.meta.env.VITE_API_ROUTE}/api/TestResult`;

  const obj = {
    responseBundle: testResponseBundle,
    emailToSend: emailAddress,
  };

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
}

export async function getTestList(): Promise<Test[]> {
  const data: Test[] = [];

  const auth = getAuth();

  for (const kind of ["external", "qti"] as const) {
    const url = auth
      ? `${import.meta.env.VITE_API_ROUTE}/api/admin/${kind}Tests`
      : `${import.meta.env.VITE_API_ROUTE}/api/${kind}Tests`;
    const options = { headers: { "Authorization": `Basic ${auth}` } };
    console.log(url);

    const res = await fetch(url, auth ? options : undefined);

    const json = await res.json();

    for (let i = 0; i < json.length; i++) {
      const { name, description, tags, status, id } = json[i];
      const test = {
        name,
        description,
        id,
        kind,
        tags: tagsListToObject(tags),
        itemInfo: tagsListToItemInfo(tags),
        status: status === 0,
      };

      data.push(test);
    }
  }

  data.sort((a, b) => a.id.localeCompare(b.id));

  console.log(data);

  return data;
}

export async function loadItemXML(
  test_url: string,
  item_path: string,
): Promise<string> {
  const url = `${test_url}/../${item_path}`;

  const res = await fetch(url);
  const xml = await res.text();

  const modified_xml = xml
    .replaceAll('src="', `src=\"${url}/../`)
    .replaceAll(
      "qti-inline-choice-interaction",
      `qti-inline-choice-interaction dataPrompt=""`,
    )
    .split("\n").slice(1).join("\n");

  return modified_xml;
}

export async function getTestWithURLWithID(
  id: string,
  default_auth?: string | null,
): Promise<TestWithURL> {
  const auth = default_auth === undefined ? getAuth() : default_auth;

  const url = auth
    ? `${import.meta.env.VITE_API_ROUTE}/api/admin/externalTest/${id}`
    : `${import.meta.env.VITE_API_ROUTE}/api/externalTest/${id}`;

  const headers = auth ? { "Authorization": `Basic ${auth}` } : {};
  const res = await fetch(url, { headers: headers });

  if (!res.ok) {
    throw new Error("Can't fetch the test");
  }

  const json = await res.json();

  const test: Test = {
    name: json.name,
    description: json.description,
    status: json.status === 1,
    id: json.id,
    tags: tagsListToObject(json.tags),
    itemInfo: tagsListToItemInfo(json.tags),
    kind: "external",
  };

  return {
    test,
    url: json.url,
  };
}

export async function getTestWithPackageWithID(
  id: string,
  default_auth?: string | null,
): Promise<TestWithPackage> {
  const auth = default_auth === undefined ? getAuth() : default_auth;

  const url = auth
    ? `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${id}`
    : `${import.meta.env.VITE_API_ROUTE}/api/qtitest/${id}`;

  const headers = auth ? { "Authorization": `Basic ${auth}` } : {};
  const res = await fetch(url, { headers: headers });

  if (!res.ok) {
    throw new Error("Can't fetch the test");
  }

  const json = await res.json();

  const test: Test = {
    name: json.name,
    description: json.description,
    status: json.status === 1,
    id: json.id,
    tags: tagsListToObject(json.tags),
    itemInfo: tagsListToItemInfo(json.tags),
    kind: "qti",
  };

  return {
    test,
    packageBase64: json.packageBase64,
  };
}

export async function patchTestVisibilityStatusWithID(
  id: string,
  kind: "qti" | "external",
  visibilityStatus: boolean,
): Promise<boolean> {
  const auth = getAuth();

  if (!auth) {
    throw new Error(
      "Can't patch test visibility status if the user is not authenticated.",
    );
  }

  const obj = {
    status: visibilityStatus ? 0 : 1,
  };

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/${kind}Test/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(
        obj,
      ),
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    },
  );

  return res.ok;
}

export async function putTestWithPackage(
  test: TestWithPackage,
): Promise<Response> {
  const auth = getAuth();

  if (!auth) {
    throw new Error("Can't upload a test if the user is not authenticated.");
  }

  const obj = {
    ...test.test,
    tags: tagsObjectToList(test.test.tags),
    status: Number(!test.test.status),
    packageBase64: test.packageBase64,
  };

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(obj),
    },
  );

  return res;
}

export async function putTestWithURL(
  test: TestWithURL,
): Promise<Response> {
  const auth = getAuth();

  if (!auth) {
    throw new Error("Can't upload a test if the user is not authenticated.");
  }

  const obj = {
    ...test.test,
    tags: tagsObjectToList(test.test.tags),
    status: Number(!test.test.status),
    url: test.url,
  };

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/externalTest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(obj),
    },
  );

  return res;
}

export type TestPatch = {
  name?: string;
  description?: string;
  tags?: Tags;
  status?: boolean; // visibility status
  data?: string;
};
export async function patchTestWithID(
  id: string,
  kind: "qti" | "external",
  test_patch: TestPatch,
): Promise<Response> {
  const auth = getAuth();

  if (!auth) {
    throw new Error("Can't patch a test if the user is not authenticated.");
  }

  const obj: any = {};

  if (test_patch.name) {
    obj.name = test_patch.name;
  }

  if (test_patch.description) {
    obj.description = test_patch.description;
  }

  if (test_patch.tags) {
    obj.tags = tagsObjectToList(test_patch.tags);
  }

  if (test_patch.status) {
    obj.status = Number(!test_patch.status);
  }

  if (test_patch.data) {
    if (kind === "qti") {
      obj.packageBase64 = test_patch.data;
    } else {
      obj.url = test_patch.data;
    }
  }

  console.log(obj);
  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/${kind}Test/${id}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    },
  );

  return res;
}

export async function deleteTestWithID(
  id: string,
  kind: "qti" | "external",
): Promise<Response> {
  const auth = getAuth();

  if (!auth) {
    throw new Error("Can't delete a test if the user is not authenticated.");
  }

  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/${kind}Test/${id}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Basic ${auth}`,
      },
    },
  );

  return res;
}
