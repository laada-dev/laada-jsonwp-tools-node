#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const {
  openapiSchemaToJsonSchema,
} = require("@openapi-contrib/openapi-schema-to-json-schema");

const parseSchemaProperties = (schemaObject) => {
  for (const key in schemaObject) {
    if (typeof schemaObject[key] == "object" && schemaObject[key] !== null) {
      parseSchemaProperties(schemaObject[key]);
    } else {
      if (key == "$ref") {
        schemaObject[key] = schemaObject[key].replace(
          "#/components/schemas/",
          "#/properties/",
        );
      }
    }
  }
};

const main = () => {
  const openApiJsonPath = path.join(
    process.cwd(),
    "app/public/schema",
    "openapi.json",
  );
  const jsonSchemaPath = path.join(
    process.cwd(),
    "app/public/schema",
    "schema.json",
  );
  const openApiSchemaJson = require(openApiJsonPath);

  if (openApiSchemaJson) {
    const jsonSchema = openapiSchemaToJsonSchema(
      openApiSchemaJson.components.schemas,
    );
    delete jsonSchema.$schema;

    parseSchemaProperties(jsonSchema);

    fs.writeFileSync(
      jsonSchemaPath,
      JSON.stringify({
        $schema: "http://json-schema.org/draft/2020-12/schema",
        title: "SiteSchema",
        type: "object",
        required: Object.keys(jsonSchema),
        properties: jsonSchema,
      }),
    );
  }
};

main();
