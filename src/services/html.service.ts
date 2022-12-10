import fs from "fs/promises"

const saveBufferToFile = async (
    imageBuffer: Buffer
): Promise<string> => {
    const fileUrl = new URL(`../../resources/submissions/test.jpeg`, import.meta.url);
    const file = await fs.writeFile(fileUrl, imageBuffer)

    return fileUrl.toString();
}

export { saveBufferToFile };