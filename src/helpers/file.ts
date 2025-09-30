export const isValidEditFileType = (value: string) => {
    return /\.(pdf|docx?|xlsx?|pptx?)$/i.test(value);
}

export const acceptFileTypes = [
    "image/*",
    ".docx",
    ".doc",
    ".pdf",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
];