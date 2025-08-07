#!/usr/bin/env node

/* global console */

import { readdir, readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { parse } from "svgson"
import process from "process"

const sourceDir = "icons"
const outputDir = "src/icons"

async function convertSvgToTs() {
  try {
    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true })

    const files = await readdir(sourceDir)
    const svgFiles = files.filter((file) => file.endsWith(".svg"))

    console.log(`Converting ${svgFiles.length} SVG files to TypeScript...`)

    for (const file of svgFiles) {
      const svgPath = join(sourceDir, file)
      const tsPath = join(outputDir, file.replace(".svg", ".ts"))

      const svgContent = await readFile(svgPath, "utf8")
      const jsonObj = await parse(svgContent)

      // Generate TypeScript content
      const tsContent = `const ${toCamelCase(
        file.replace(".svg", "")
      )} = ${JSON.stringify(jsonObj, null, 2)} as const;

export default ${toCamelCase(file.replace(".svg", ""))};
`

      await writeFile(tsPath, tsContent)
    }

    console.log(`✅ Converted ${svgFiles.length} files successfully!`)
  } catch (error) {
    console.error("Error converting files:", error)
    process.exit(1)
  }
}

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

convertSvgToTs()
