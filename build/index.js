const {readFile, readdir, writeFile, mkdir, copyFile} = require("fs").promises;
const {existsSync} = require("fs");
const {join, resolve} = require("path");

const inputDir = "./components/src";
const outputDir = "./components/dist";
const utils = join(inputDir, "utils.js");

async function run()
{
  const components = await getComponents();
  await ensureDir(outputDir);
  await copyFile(utils, join(outputDir, "utils.js"));
  components.forEach(build);
}


async function getComponents()
{
  
  const dirents = await readdir(inputDir, { withFileTypes: true });
  const components = dirents.filter(dirent => dirent.isDirectory())
                            .map(dirent => dirent.name);
  return components;
}

async function readContent(path)
{
  if(existsSync(path))
    return await readFile(path, "utf8");
  else
    return "";
}

async function ensureDir(dir)
{
  if (!existsSync(dir))
    await mkdir(dir);
}

async function build(name)
{
  const componentContent = await readContent(join(inputDir, name, name + ".js"));
  const css = await readContent(join(inputDir, name, name + ".css"));
  const html = await readContent(join(inputDir, name, name + ".html"));
  const builtContent = componentContent.replace("${pmLoadCSS}", css).replace("${pmLoadHTML}", html);
  await ensureDir(join(outputDir, name));
  await writeFile(join(outputDir, name, name + ".js"), builtContent, "utf8");
  console.log(`${name} build ready.`);
}

run();
