export const ignorePath = ["env", "__pycache__", "node_modules", "package-finder-output.json"]

export const ignoreType = ['psd', 'xcf', 'tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'gif', 'png', 'eps', 'raw', 'cr2', 'nef', 'orf', 'sr2', 'bin', 'exe', 'session']

export type jsonFileType = {
	path:string,
	text:string,
	line:string
}