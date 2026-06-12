import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.tsx", "src/api/client.ts", "server/**/*.ts", "shared/**/*.ts"],
  ignore: ["src/api/client.ts", "shared/types.ts"],
};

export default config;
