const SPINES = [
  "--spine-1", "--spine-2", "--spine-3", "--spine-4",
  "--spine-5", "--spine-6", "--spine-7", "--spine-8",
];

export function spineVarFor(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `var(${SPINES[hash % SPINES.length]})`;
}
