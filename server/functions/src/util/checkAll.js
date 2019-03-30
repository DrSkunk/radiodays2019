export default function checkAll(items) {
  Object.keys(items).forEach(key => {
    const value = items[key];
    if (value === undefined) {
      throw new Error(`${key} is required`);
    }
  });
}
