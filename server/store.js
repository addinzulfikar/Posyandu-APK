const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, 'data.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      balita: [],
      ibuHamil: [],
      lansia: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    const data = JSON.parse(raw);
    return {
      balita: Array.isArray(data.balita) ? data.balita : [],
      ibuHamil: Array.isArray(data.ibuHamil) ? data.ibuHamil : [],
      lansia: Array.isArray(data.lansia) ? data.lansia : [],
    };
  } catch {
    const fallback = { balita: [], ibuHamil: [], lansia: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

function writeDb(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function newId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function findById(list, id) {
  return list.find((x) => x.id === id);
}

function upsert(list, id, patch) {
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch, id };
  return list[idx];
}

function removeById(list, id) {
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  return removed;
}

module.exports = {
  readDb,
  writeDb,
  newId,
  nowIso,
  findById,
  upsert,
  removeById,
};
