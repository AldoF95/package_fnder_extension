import * as vscode from 'vscode';
import Search, { writeToJsonFile } from './search';
import { jsonFileType } from './constants';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('package-finder.search', async (args:string[]) => {

		const keyword = await vscode.window.showInputBox({placeHolder:'Keyword/package/function to search loaction'})

		if(keyword){
			vscode.window.showInformationMessage(`Searching for: <${keyword}>`)
			const roots = vscode.workspace.workspaceFolders
			try{
				if(roots){
					for await (const root of roots){
						const res:jsonFileType[] = await Search(root.uri.fsPath, keyword)
						if(res.length!=0){
							const savePath = `${root.uri.fsPath}\\package-finder-output.json`
							const outcome = await writeToJsonFile(savePath, JSON.stringify(res))
							if(outcome){vscode.window.showInformationMessage(`Search results saved in package-finder-output.json`)}
							else{vscode.window.showErrorMessage(`Something went wrong while saving the search result`)}
						}	
						else{vscode.window.showWarningMessage(`No <${keyword}> found in this project`)}
					}
				}
				else{vscode.window.showWarningMessage(`No root workspace found`)}

			}catch{
				vscode.window.showErrorMessage(`Something went wrong while searching for the <${keyword}>`)
			}
			
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}