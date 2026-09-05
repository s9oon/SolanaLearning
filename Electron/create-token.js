import { spawn } from "child_process";
import path from "path";

const mjsFile = ""; // <- change to path

const mjsFile_example = "./create-token.mjs";

console.log("Executing:", mjsFile);

// Execute the .mjs
const child = spawn(
  process.execPath,
  [path.resolve(mjsFile)],
  {
    stdio: "inherit"
  }
);

child.on("close", (code) => {
  console.log(`create-token.mjs exited with code ${code}`);
});