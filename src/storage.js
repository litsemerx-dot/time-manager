import AsyncStorage from '@react-native-async-storage/async-storage';

// Общее хранилище задач и заметок. Данные лежат в памяти телефона.
// Все экраны берут и сохраняют задачи и заметки только через эти функции.
//
// Задача:  { id, title, date: "2026-10-10", time: "18:00", durationMin: 60,
//            priority: "low" | "medium" | "high", done: false, spentMin: 0 }
// Заметка: { id, folder: "Дневник", title, text, date: "2026-10-10" }
//
// Все функции асинхронные, поэтому вызываем их с await:
//   const tasks = await getTasks();
//   await addTask({ title: 'Сделать домашку', date: '2026-10-10' });

const TASKS_KEY = 'tasks';
const NOTES_KEY = 'notes';

async function readList(key) {
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : [];
}

async function writeList(key, list) {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

function newId() {
  return String(Date.now()) + Math.floor(Math.random() * 1000);
}

// ---------- Задачи ----------

export async function getTasks() {
  return readList(TASKS_KEY);
}

// Добавляет задачу и возвращает её вместе с новым id.
export async function addTask(task) {
  const newTask = {
    id: newId(),
    title: '',
    date: '',
    time: '',
    durationMin: 0,
    priority: 'medium',
    done: false,
    spentMin: 0,
    ...task,
  };
  const tasks = await getTasks();
  await writeList(TASKS_KEY, [...tasks, newTask]);
  return newTask;
}

// Меняет только переданные поля, например updateTask(id, { done: true }).
export async function updateTask(id, changes) {
  const tasks = await getTasks();
  const updated = tasks.map((t) => (t.id === id ? { ...t, ...changes } : t));
  await writeList(TASKS_KEY, updated);
}

export async function deleteTask(id) {
  const tasks = await getTasks();
  await writeList(TASKS_KEY, tasks.filter((t) => t.id !== id));
}

// ---------- Заметки ----------

export async function getNotes() {
  return readList(NOTES_KEY);
}

// Добавляет заметку и возвращает её вместе с новым id.
export async function addNote(note) {
  const newNote = {
    id: newId(),
    folder: 'Без папки',
    title: '',
    text: '',
    date: new Date().toISOString().slice(0, 10),
    ...note,
  };
  const notes = await getNotes();
  await writeList(NOTES_KEY, [...notes, newNote]);
  return newNote;
}

export async function updateNote(id, changes) {
  const notes = await getNotes();
  const updated = notes.map((n) => (n.id === id ? { ...n, ...changes } : n));
  await writeList(NOTES_KEY, updated);
}

export async function deleteNote(id) {
  const notes = await getNotes();
  await writeList(NOTES_KEY, notes.filter((n) => n.id !== id));
}
