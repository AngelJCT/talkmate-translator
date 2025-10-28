export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const { result } = reader;
      if (typeof result === 'string') {
        // Remove the data URL prefix e.g. "data:image/png;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Unable to read file as string'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
