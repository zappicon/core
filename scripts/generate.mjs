import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const iconsDir = path.join(__dirname, "../src/icons")
const outputFile = path.join(__dirname, "../src/index.ts")

// Get all TypeScript  component files
const componentFiles = fs
  .readdirSync(iconsDir)
  .filter((file) => file.endsWith(".ts"))
  .map((file) => path.basename(file, ".ts"))

// Convert kebab-case to camelCase
function toCamelCase(str) {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1)
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join("")
}

// Generate tree-shakeable exports
const exports = componentFiles
  .map((componentName) => {
    const camelCaseName = toCamelCase(componentName)
    return `export { default as ${camelCaseName} } from './icons/${componentName}';`
  })
  .join("\n")

// Write the index file
fs.writeFileSync(outputFile, exports)
