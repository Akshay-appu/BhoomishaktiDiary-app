// A sync row identifier only needs to be unique, not cryptographically
// unguessable, so a Math.random()-based v4-shaped id avoids pulling in a
// dedicated uuid package (checked: `uuid` is only an undeclared transitive
// dependency of something else, unsafe to import directly) or expo-crypto.
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
