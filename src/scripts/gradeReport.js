export function compileGradeReport(states) {
  console.log(states);
  let report = "";
  let header = "";
  for (let i = 0; i < states.length; i++) {
    if (i != 0) {
      header += ",";
      report += ",";
    }
    for (let elt of states[i].state.responseVariables) {
      header += i + 1 + " " + elt.identifier;
      report += elt.value;
      header += ",";
      report += ",";
    }
  }

  return header + "\n" + report;
}
