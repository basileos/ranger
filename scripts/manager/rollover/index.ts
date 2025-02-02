import {executeRollover} from "../../../src/implementations/executeRollover";

(async () => {
  await executeRollover("TODO", "TODO");
})().catch((error: any) => {
  console.error(error);
  process.exitCode = 1;
});
