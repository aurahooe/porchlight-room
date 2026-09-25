const EDITIONS = [
  ["The porch light is on.", "Someone left the door unlatched. Come sit. The hour is still warm."],
  ["Rain on the awning.", "The room keeps a smaller voice after midnight. Write like the neighbors might hear."],
  ["Coffee gone cold.", "A note does not have to be finished to be true. Leave it on the rail."],
  ["Second wind.", "The street is quieter than it looks. Public notes glow. Private ones stay in the drawer."],
  ["Blue hour.", "The masthead changes when the clock does. Nothing here is frozen on purpose."],
  ["Kitchen window.", "If you mark a slip public it walks out onto the stoop. That is the whole contract."],
];

export function copyForHour(date = new Date()) {
  const i = date.getUTCHours() % EDITIONS.length;
  return EDITIONS[i];
}

export function hourKey(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

export function nextHour(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.getTime();
}
