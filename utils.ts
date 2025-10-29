// Takes a period name like "Mod 4 (Lunch A)" and returns its canonical base name, "Mod 4".
export const getCanonicalModName = (name: string): string => {
  if (!name) return '';
  // This regex matches "Mod " followed by one or more digits, at the beginning of the string.
  const match = name.match(/^(Mod \d+)/);
  if (match) {
    return match[1];
  }
  // Returns the original name for special cases like 'SHIELD TIME', 'Passing Period', etc.
  return name;
<<<<<<< HEAD
};
=======
};
>>>>>>> 351c5c58421796d6a5fafd0ae715990beda3f12c
