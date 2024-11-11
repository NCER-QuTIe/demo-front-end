function georgianize(s) {
  const dictionary = {
    numAttempts: "რამდენჯერ სცადა",
    duration: "რა დრო დაუთმო",
  };
  if (dictionary[s]) {
    return dictionary[s];
  }
  return s.replace("RESPONSE", "პასუხი").replace("_", " ");
}

export function compileGradeReport(states) {
  console.log(states);
  let report = [];
  let header = [];
  for (let i = 0; i < states.length; i++) {
    for (let elt of states[i].state.responseVariables) {
      header.push(i + 1 + " " + georgianize(elt.identifier));
      report.push(elt.value);
    }
  }

  return header.join(",") + "\n" + report.join(",");
}
