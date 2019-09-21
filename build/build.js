const {readFile, readdir, writeFile, mkdir, copyFile} = require("fs").promises;
const {existsSync, rmdirSync, readdirSync, lstatSync, unlinkSync} = require("fs");
const {join} = require("path");

const inputDir = "./components/src";
const outputDir = "./components/dist";
const utils = join(inputDir, "utils.js");

/**
 * Builds the components by combining CSS and HTML files into the src.
 * ${pmLoadHTML} - Load HTML file that matches component name in dir.
 * ${pmLoadCSS} - Load CSS file that matches component name in dir.
 */
async function build()
{
  if (existsSync(outputDir))
    clearBuild(outputDir);
  const components = await getComponents();
  await ensureDir(outputDir);
  await copyFile(utils, join(outputDir, "utils.js"));
  components.forEach(compile);
}

/**
 * Extract component names from the directories
 */
async function getComponents()
{
  
  const dirents = await readdir(inputDir, { withFileTypes: true });
  const components = dirents.filter(dirent => dirent.isDirectory())
                            .map(dirent => dirent.name);
  return components;
}

/**
 * Reads content of the file
 * @param {String} path file path
 */
async function readContent(path)
{
  if(existsSync(path))
    return await readFile(path, "utf8");
  else
    return "";
}

/**
 * Create dir if doesn't exist
 * @param {String} dir path to the directory
 */
async function ensureDir(dir)
{
  if (!existsSync(dir))
    await mkdir(dir);
}

/**
 * Compile component which filename and folder name matches the component
 * @param {String} name of the component
 */
async function compile(name)
{
  const componentContent = await readContent(join(inputDir, name, name + ".js"));
  const css = await readContent(join(inputDir, name, name + ".css"));
  const html = await readContent(join(inputDir, name, name + ".html"));
  const builtContent = componentContent.replace("${pmLoadCSS}", css).replace("${pmLoadHTML}", html);
  await ensureDir(join(outputDir, name));
  await writeFile(join(outputDir, name, name + ".js"), builtContent, "utf8");
  console.log(`${name} build ready.`);
}

/**
 * Recursively removes the dist directory
 * @param {String} path dist directory path
 */
function clearBuild(path)
{
  if(existsSync(path)) 
  {
    readdirSync(path).forEach((file) =>
    {
      const curPath = join(path, file);
      if(lstatSync(curPath).isDirectory())
        clearBuild(curPath);
      else
        unlinkSync(curPath);
    });
    rmdirSync(path);
  }
};


module.exports = {build};