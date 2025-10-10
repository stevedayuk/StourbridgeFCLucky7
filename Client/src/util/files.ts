export type FileNameWithExt = {
    fileNameWithoutExtension: string,
    extension: string
}

export function getFileNameWithExt(fileName: string) {
    const lastDot = fileName.lastIndexOf('.');

    const fileNameWithoutExtension = fileName.substring(0, lastDot);
    const extension = fileName.substring(lastDot + 1);

    return {
        fileName: fileNameWithoutExtension,
        extension: extension
    }
}