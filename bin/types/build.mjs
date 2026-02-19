#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { compileFromFile } from "json-schema-to-typescript";

const main = () => {
  const jsonSchemaPath = path.join(
    process.cwd(),
    "app/public/schema",
    "schema.json",
  );
  const typesDefintionPath = path.join(
    process.cwd(),
    "src/types",
    "types.d.ts",
  );
  compileFromFile(jsonSchemaPath, {
    additionalProperties: false,
  }).then((ts) => fs.writeFileSync(typesDefintionPath, ts));
};

main();
