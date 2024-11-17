export function blob2base64(blob, mimeType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrlPrefix = `data:${mimeType};base64,`;
      const base64WithDataUrlPrefix = reader.result;
      const base64 = base64WithDataUrlPrefix.replace(dataUrlPrefix, "");
      resolve(base64);
    };
    reader.onerror = reject;
    console.log(blob);
    reader.readAsDataURL(blob);
  });
}
