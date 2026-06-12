import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.tsx", "src/api/client.ts", "server/**/*.ts", "shared/**/*.ts"],
  ignore: ["src/api/client.ts", "shared/types.ts"],
  ignoreDependencies: ["tsx"],
  ignoreBinaries: ["tsx"],
};

export default config;
