import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.tsx", "src/api/client.ts", "server/**/*.ts", "shared/**/*.ts"],
  ignore: ["src/api/client.ts", "shared/types.ts"],
  ignoreBinaries: ["tsx"],
  ignoreDependencies: ["tsx"],
};

export default config;
