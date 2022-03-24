import { Check as MdiCheck } from "mdi-material-ui";
import { Check as MuiCheck, CheckBox } from "@mui/icons-material";
import { Check as PhCheck } from "phosphor-react";
import { merge } from "lodash";

const foo = { foo: "foo" };
const bar = { bar: "bar" };

function App() {
  return (
    <div className="App">
      <div>{JSON.stringify(merge(foo, bar))}</div>
      <MdiCheck />
      <CheckBox />
      <MuiCheck />
      <PhCheck />
    </div>
  );
}

export default App;
