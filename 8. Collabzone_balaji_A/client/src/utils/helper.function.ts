/* eslint-disable @typescript-eslint/no-explicit-any */
export function convertStyleToReact(styleStr: string) {
  const styleObject: any = {};
  for (const rule of styleStr.split(";")) {
    if (!rule) {
      continue;
    }
    // Split each rule at the colon, removing leading/trailing whitespace
    const [key, value] = rule.trim().split(": ");
    // Convert key to camelCase (e.g., background-color -> backgroundColor)
    const camelCaseKey = key.replace(/-([a-z])/g, (match, group1) =>
      group1.toUpperCase()
    );
    // Assign entire value after colon (including variables)
    styleObject[camelCaseKey] = value || "";
  }
  return styleObject;
}

export function convertFileToDataURL(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
