import fs from "node:fs/promises"
import path from "node:path"

const folderJsonPath = path.resolve("folder.json")
async function handleFolder() {
    try {
        const folderJsonContent = await fs.readFile(folderJsonPath)
        const folderJson = JSON.parse(folderJsonContent.toString("utf-8"))
        const folderNamePath = path.resolve(folderJson.name)

        if (folderJson.type == "folder") {
            const statistics = await isFileOrDirec(folderNamePath)
            if (!statistics) {
                await fs.mkdir(folderNamePath)
            }
            if (folderJson.children) {
                forFoldersFiles(folderJson.children, folderNamePath)
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function forFoldersFiles(children, folderNamePath) {
    children.forEach(async (file) => {
        if (file.type == "file") {
            const folderChilFilePath = path.resolve(`${folderNamePath}/${file.name}`)
            const folderChilFileStats = await isFileOrDirec(folderChilFilePath)
            if (!folderChilFileStats) {
                try{

                    await fs.writeFile(folderChilFilePath, file.content)
                }
                catch(err){
                    console.log("There is a folder named");
                }
            } else {
                console.log("There is a folder named")
            }
        } else if (file.type == "folder") {
            const folderChillFolderPath = path.resolve(`${folderNamePath}/${file.name}`)
            const folderChillFolderStats = await isFileOrDirec(folderChillFolderPath)
            if (!folderChillFolderStats) {
                await fs.mkdir(folderChillFolderPath)
                if (file.children) {
                     await forFoldersFiles(file.children, folderChillFolderPath)
                }
            }
        }
        else console.log("everything is clear");
    })
}

async function isFileOrDirec(path) {
    try {
        return await fs.stat(path)
    }
    catch (err) {
        return null
    }
}

handleFolder()