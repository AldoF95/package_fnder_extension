import * as fs from 'fs'
import * as fsPromise from 'fs/promises';
import * as util from 'util'
import * as readline from 'readline'
import { jsonFileType, ignoreType, ignorePath } from "./constants"

const stat = util.promisify(fs.stat)

const Search = async (root:string, keyword:string)=>{
	let listres:jsonFileType[] = []
	const files = fs.readdirSync(root)

	for await (const file of files){
		if(!ignorePath.includes(file)){
			let path = `${root}\\${file}`
				const stats = await stat(path)	
				if(stats.isDirectory()){
					let res = await Search(path, keyword)
					listres.push(...res)
				}
				else{
					const fileType = file.split(".").pop()?.trim().toLowerCase()
					if(!ignoreType.includes(fileType!)){
						const res = await readFile(path, keyword)
						if(res[0]){
							listres.push({path:path, text:res[0].toString(), line:res[1].toString()})
						}
					}					
				}
		}	
	}
	return listres
}

const readFile = async (uri:string, keyword:string)=>{
	let lines:string = ""
	const reader = readline.createInterface({
		input: fs.createReadStream(uri),
		crlfDelay:Infinity
	})
	let counter:number = 0
	for await (const line of reader){
		counter+=1
		const lineSearch = findKeyword(line, keyword)
		if(lineSearch){	
			lines = lineSearch
			reader.close()
			reader.removeAllListeners()
			break
		}
	}
	if(lines!="") return [lines, counter]
	return [false, false]
}

const findKeyword = (line:string, keyword:string)=>{
	const reg = new RegExp(keyword.toLowerCase())
	let regRes = line.toLowerCase().match(reg)
	if(regRes != null){return line}
	return false
}

export const writeToJsonFile = async (savePath:string, data:string)=>{
    try{
        await fsPromise.writeFile(savePath, data)
        return true
    }catch{
        return false
    }
    

}
export default Search