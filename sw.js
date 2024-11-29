"use strict";

import { ZipReader, BlobWriter, BlobReader } from "@zip.js/zip.js";

let files = {};
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  const validPrefix = self.registration.scope + "file/";
  console.log("viable for interception", validPrefix);

  if (request.url.startsWith(validPrefix)) {
    console.log("intercepting!", request.url);
    const path = request.url.slice(validPrefix.length);
    console.log({ path });
    const s = path.split("/");

    const testID = s.shift();
    const fileName = s.join("/");
    //
    event.respondWith(handleRequest(request, testID, fileName));
  }
});

async function handleRequest(request, testID, fileName) {
  if (files[testID] == undefined) {
    console.log("fetching dataaa");
    const url = `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${testID}`;
    console.log("fetching", url);
    let res = await fetch(url);
    let json = await res.json();
    let b64 = json.packageBase64;
    let file = await fetch(`data:text/plain;base64,${b64}`);
    let blob = await file.blob();
    files[testID] = blob;
    console.log("fetched dataaa!!!");
  }

  let reader;
  try {
    console.log("trying to read", files[testID]);
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
