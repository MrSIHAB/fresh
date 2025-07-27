import { defineConfig } from "npm:vite@^7.0.6";
import { fresh } from "../src/mod.ts";

export default defineConfig({
  plugins: [fresh()],
});
