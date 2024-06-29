var fs = require('fs');

var files = fs.readdirSync('.');
var mdFiles = files.filter(it => it.endsWith(".md"))

const templateFilePath = "template.html"
const templateContent = fs.readFileSync(templateFilePath).toString();

mdFiles.forEach(mdFile => {
    const mdContent = fs.readFileSync(mdFile).toString();
    const sourceContentStart = mdContent.indexOf("\n") + 1;
    const transPathStart = mdContent.indexOf("###", 10);
    const transContentStart = mdContent.indexOf("\n", transPathStart) + 1;

    const generatedContent = templateContent
        .replace("$source", mdContent.slice(sourceContentStart, transPathStart))
        .replace("$trans", mdContent.slice(transContentStart));
    
    const htmlFileName = mdFile.slice(0, -2) + "html";
    fs.writeFileSync("../html/" + htmlFileName, generatedContent);
    console.log("Đã tạo file: ", htmlFilePath)
})