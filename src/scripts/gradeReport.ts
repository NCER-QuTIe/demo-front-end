import { TestResponse } from "./types.d.ts";

import writeXlsxFile, { type SheetData } from "write-excel-file";

export async function compileGradeReport(
  testResponse: TestResponse,
) {
  const data: SheetData = [];

  const header = ["დავალება", "რა დრო დაუთმო"];
  const number_of_columns = states.reduce(
    (a, e) => Math.max(e.responses.length, a),
    0,
  );
  header.push("ქულა");
  header.push("მაქსიმალური ქულა");
  for (let i = 0; i < number_of_columns; i++) {
    header.push("პასუხი " + (i + 1));
  }

  const widths: number[] = header.map((e) => e.length);

  data.push(header.map((e) => ({ value: e, fontWeight: "bold" })));

  for (let i = 0; i < states.length; i++) {
    const duration_minutes = Math.floor(states[i].duration / 60).toString();
    const duration_seconds = (states[i].duration % 60).toString();
    const duration = states[i].duration >= 60
      ? `${duration_minutes}:${duration_seconds.padStart(2, "0")} წთ`
      : `${duration_seconds} წმ`;
    const row = [i + 1 + "", duration + ""];
    row.push(results[i].score + "");
    row.push(results[i].max_score + "");
    for (const elt of states[i].responses) {
      let e = "";
      if (elt.response) {
        e = elt.response + "";
      } else {
        e = "_";
      }
      widths[row.length] = Math.max(widths[row.length], e.length);
      row.push(e);
    }
    data.push(row.map((e) => ({ value: e, type: String })));
  }

  const columns = widths.map((e) => ({ width: Math.round(1.6 * e) }));

  await writeXlsxFile(data, {
    columns,
    fileName: "შედეგები.xlsx",
  });
}
