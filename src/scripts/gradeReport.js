const dictionary = {
  numAttempts: "რამდენჯერ სცადა",
  duration: "რა დრო დაუთმო",
  RESPONSE: "პასუხი",
};
const delimeter = ",";

function georgianize(s) {
  for (let key of Object.keys(dictionary)) {
    s = s.replace(key, dictionary[key]);
  }
  return s.replace("_", " ");
}

export function compileGradeReport(states) {
  console.log(states);
  let report = [];
  let header = [];
  for (let i = 0; i < states.length; i++) {
    for (let elt of states[i].state.responseVariables) {
      header.push(i + 1 + " " + georgianize(elt.identifier));
      report.push('"' + ("" + elt.value).replace('"', '\\"') + '"');
    }
  }

  return header.join(delimeter) + "\n" + report.join(delimeter);
}
