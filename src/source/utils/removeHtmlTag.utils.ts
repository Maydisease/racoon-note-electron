// removeHtmlTag
export const removeHtmlTag = (sourceStr: string): string => {

    // 去除HTML tag
    sourceStr = sourceStr.replace(/<\/?[^>]*>/g, '');
    // 去除行尾空白
    sourceStr = sourceStr.replace(/[ | ]*\n/g, '\n');
    // 去除多余空行
    sourceStr = sourceStr.replace(/\n[\s| | ]*\r/g, '\n');
    // 去掉&nbsp;
    sourceStr = sourceStr.replace(/&(nbsp|amp);/ig, '');

    return sourceStr;
};
