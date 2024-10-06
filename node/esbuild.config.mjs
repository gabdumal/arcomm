// esbuild.config.js
import esbuild from "esbuild";

esbuild
  .build({
    write: true,
    bundle: true,
    entryPoints: ["src/cli.tsx"],
    outdir: "dist",
    platform: "node",
    target: "node16",
    packages: "external",
    format: "esm",
    sourcemap: true,
  })
  .catch(() => process.exit(1));
