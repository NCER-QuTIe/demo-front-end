export function compileGradeReport(states) {
  console.log(states);
  let report = [];
  let header = [];
  for (let i = 0; i < states.length; i++) {
    for (let elt of states[i].state.responseVariables) {
      header.push(i + 1 + " " + elt.identifier);
      report.push(elt.value);
    }
  }

  return header.join(",") + "\n" + report.join(",");
}
