"use strict";

import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";
import { getTestWithPackageWithID } from "./src/scripts/api.ts";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

const files = {};
const tests = {};
let auth = null;

self.addEventListener("fetch", (event) => {
  const { request } = event;

  const validPrefix = self.registration.scope + "file/";

  if (request.url.startsWith(validPrefix)) {
    // console.log("intercepting!", request.url);
    const path = request.url.slice(validPrefix.length);
    const s = path.split("/");

    const testID = s.shift();
    const fileName = s.join("/");

    event.respondWith(handleRequest(request, testID, fileName));
  }
});

self.addEventListener("message", (event) => {
  auth = event.data;
});

async function handleRequest(request, testID, fileName) {
  fileName = decodeURI(fileName);

  if (files[testID] == undefined) {
    const testPackage = await getTestWithPackageWithID(testID, auth);

    const file = await fetch(
      `data:text/plain;base64,${testPackage.packageBase64}`,
    );
    const blob = await file.blob();
    files[testID] = blob;
    tests[testID] = testPackage.test;
    console.log(testPackage.test);
    console.log(`loaded the test with id: ${testID}`);
  }

  if (fileName == "testItemInfo") {
    return new Response(JSON.stringify(tests[testID].itemInfo), {
      headers: { "content-type": "application/json" },
    });
  }

  if (fileName == "testName") {
    return new Response(tests[testID].name, {
      headers: { "content-type": "text/plain" },
    });
  }

  let reader;
  try {
    // console.log("trying to read test with id: ", testID);
    reader = new ZipReader(new BlobReader(files[testID]));
    const response = await zipreadfile(reader, fileName, request);

    return response;
  } catch (error) {
    // todo status codes
    return new Response("eh " + error.message, {
      headers: { "content-type": "text/plain" },
      // status: 0,
    });
  } finally {
    // close the ZipReader
    if (reader) reader.close();
  }
}

async function zipreadfile(reader, fileName, request) {
  // get all entries from the zip
  const entries = await reader.getEntries();
  console.log({ entries });

  if (!entries) {
    throw new Error("No entries in zip file");
  }

  if (!fileName) {
    // root
    return new Response(
      `<a href=${entries[0].filename}>${entries[0].filename}</a>`,
      {
        headers: { "content-type": "text/html" },
      },
    );
  }

  const entry = entries.find((e) => e.filename === fileName);

  if (entry) {
    if (entry.directory) {
      // TODO: don't list all entries if not directly in directory
      const listing = entries
        .filter(
          (e) => e.filename.startsWith(fileName) && e.filename !== fileName,
        )
        .map((e) => e.filename.slice(fileName.length))
        .map((f) => `<a href="${f}">${f}</a>`)
        .join("<br>");

      return new Response(listing, {
        headers: { "content-type": "text/html" },
      });
    }

    const blob = await entry.getData(new BlobWriter(), {
      // onprogress: (index, max) => { }
      useWebWorkers: false,
    });

    return new Response(blob, {
      headers: { "content-type": "text/plain" },
      // headers: { 'content-type': 'application/octet-stream' }
    });
  } else if (entries.find((e) => e.filename === fileName + "/")) {
    return new Response("Moved", {
      headers: { Location: request.url + "/" },
      status: 301,
    });
  }

  return new Response("Not found", { status: 404 });
}
