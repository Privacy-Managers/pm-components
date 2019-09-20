const {build} = require("./build");
const {readdir, stat} = require("fs").promises;
const {watch} = require("fs");
const {join} = require("path");

async function walkDir(dir, callback)
{
  (await readdir(dir)).forEach(async (file) => 
  {
    const dirPath = join(dir, file);
    const isDirectory = (await stat(dirPath)).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(join(dir, file));
  });
}

walkDir("components/src", (filePath) =>
{
  watch(filePath, () => {
    build();
  });
});
