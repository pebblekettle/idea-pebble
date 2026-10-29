const prompts = [
  'What could a cloud be saving for a rainy day?',
  'If your shadow had a tiny garden, what would it grow?',
  'What small kindness might change the shape of someone’s afternoon?',
  'Which forgotten corner would feel different with a lamp and a bench?',
  'What could a pebble teach a hurried little robot?',
  'If the fountain kept one sound, which would it choose?',
  'What color has not visited your neighborhood yet?',
  'What would you make if you had one free hour and a curious friend?',
  'Where should a very patient duck go on its next expedition?',
  'What everyday thing deserves a tiny celebration?',
  'If tomorrow arrived carrying a new color, where would you put it?',
  'What idea is small enough to try before lunch?',
];
const storageKey = 'idea-pebble-notebook-v1';
const promptEl = document.querySelector('#prompt');
const countEl = document.querySelector('#count');
const notesEl = document.querySelector('#notes');
const savedCountEl = document.querySelector('#saved-count');
const clearButton = document.querySelector('#clear');
let current = -1;

function readNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(parsed) ? parsed.filter(note => typeof note === 'string').slice(0, 60) : [];
  } catch { return []; }
}
function renderNotes() {
  const notes = readNotes();
  notesEl.replaceChildren();
  savedCountEl.textContent = `(${notes.length})`;
  clearButton.hidden = notes.length === 0;
  if (!notes.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No thoughts tucked away yet. Your first one is waiting above.';
    notesEl.append(empty);
    return;
  }
  notes.forEach((note, index) => {
    const item = document.createElement('article');
    item.className = 'note';
    const number = document.createElement('span');
    number.setAttribute('aria-hidden', 'true');
    number.textContent = '✳';
    item.append(number, document.createTextNode(note));
    notesEl.append(item);
  });
}
function choosePrompt() {
  let next = Math.floor(Math.random() * prompts.length);
  if (prompts.length > 1 && next === current) next = (next + 1) % prompts.length;
  current = next;
  promptEl.textContent = prompts[current];
  countEl.textContent = `pebble ${String(current + 1).padStart(2, '0')} / ${prompts.length}`;
}
document.querySelector('#another').addEventListener('click', choosePrompt);
document.querySelector('#keep').addEventListener('click', () => {
  if (current < 0) return;
  const notes = readNotes();
  if (!notes.includes(prompts[current])) notes.unshift(prompts[current]);
  try { localStorage.setItem(storageKey, JSON.stringify(notes.slice(0, 60))); renderNotes(); }
  catch { countEl.textContent = 'browser storage is unavailable'; }
});
clearButton.addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  renderNotes();
});
choosePrompt();
renderNotes();
