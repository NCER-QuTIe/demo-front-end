export type ItemScore = {
  attempts: number;
  duration: number;
  responses: { identifier: string; response: string }[];
};

const delimeter: string = ",";

export function compileGradeReport(states: ItemScore[]): string {
  console.log(states);

  let header = ["დავალება", "რამდენჯერ სცადა", "რა დრო დაუთმო"];
  let number_of_columns = states.reduce(
    (a, e) => Math.max(e.responses.length, a),
    0,
  );
  for (let i = 0; i < number_of_columns; i++) {
    header.push("პასუხი " + (i + 1));
    header.push("ქულა " + (i + 1));
  }

  let rows: string[] = [];

  for (let i = 0; i < states.length; i++) {
    let duration_minutes = Math.floor(states[i].duration / 60).toString();
    let duration_seconds = (states[i].duration % 60).toString();
    let duration =
      states[i].duration >= 60
        ? `${duration_minutes}:${duration_seconds.padStart(2, "0")} წთ`
        : `${duration_seconds} წმ`;
    let row = [i + 1 + "", states[i].attempts, duration];
    for (let elt of states[i].responses) {
      row.push('"' + ("" + elt.response).replaceAll('"', '\\"') + '"');
      row.push("");
    }
    rows.push(row.join(delimeter));
  }

  return header.join(delimeter) + "\n" + rows.join("\n");
}
