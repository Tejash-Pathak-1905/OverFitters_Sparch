const key = "sparsh-shortcut";
const storage = globalThis.chrome?.storage?.local;
export async function loadShortcut() {
  return storage ? (await storage.get(key))[key] : localStorage.getItem(key);
}
export async function saveShortcut(command) {
  if (storage) await storage.set({ [key]: command });
  else localStorage.setItem(key, command);
}
