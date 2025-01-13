/**
 * file转base64
 * @param file File文件
 * eg:
 *    // 调用方法 (这里使用了await 所以该代码的外层代码要加 async)
 *    const result = await fileToBase64(userFile);
 *    if(result.status) {
 *      console.log('fileBase64---',result.data);
 *    } else {
 *      console.log('error---',result.error);
 *    }
 */
export const fileToBase64 = (file: File): Promise<{ status: boolean; data?: any; error?: any }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // 转换成功
    reader.onload = () => {
      resolve({
        status: true,
        data: reader.result,
      });
    };

    // 转换失败
    reader.onerror = () => {
      reject({
        status: false,
        error: reader.error,
      });
    };
  });
};
