const express = require('express');
const {
  readDb,
  writeDb,
  newId,
  nowIso,
  findById,
  upsert,
  removeById,
} = require('./store');

function badRequest(res, message, details) {
  return res.status(400).json({ error: message, details });
}

function notFound(res, entity, id) {
  return res.status(404).json({ error: `${entity} not found`, id });
}

function createCrudRouter({ entityKey, entityName, createNormalizer }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const db = readDb();
    res.json(db[entityKey]);
  });

  router.post('/', (req, res) => {
    const body = req.body || {};
    const normalized = createNormalizer(body);
    if (normalized.error) return badRequest(res, normalized.error, normalized.details);

    const db = readDb();
    const created = {
      ...normalized.value,
      id: newId(),
      riwayatPenimbangan: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db[entityKey].push(created);
    writeDb(db);
    res.status(201).json(created);
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const item = findById(db[entityKey], id);
    if (!item) return notFound(res, entityName, id);
    res.json(item);
  });

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const patch = req.body || {};

    const db = readDb();
    const updated = upsert(db[entityKey], id, { ...patch, updatedAt: nowIso() });
    if (!updated) return notFound(res, entityName, id);
    writeDb(db);
    res.json(updated);
  });

  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const removed = removeById(db[entityKey], id);
    if (!removed) return notFound(res, entityName, id);
    writeDb(db);
    res.json({ ok: true, deleted: removed });
  });

  router.post('/:id/penimbangan', (req, res) => {
    const { id } = req.params;
    const body = req.body || {};

    const db = readDb();
    const item = findById(db[entityKey], id);
    if (!item) return notFound(res, entityName, id);

    if (!body.tanggal) {
      return badRequest(res, 'Field `tanggal` wajib diisi (YYYY-MM-DD)');
    }

    const record = {
      ...body,
      id: newId(),
      createdAt: nowIso(),
    };

    item.riwayatPenimbangan = Array.isArray(item.riwayatPenimbangan)
      ? [...item.riwayatPenimbangan, record]
      : [record];
    item.updatedAt = nowIso();

    writeDb(db);
    res.status(201).json(record);
  });

  return router;
}

function requireString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function normalizers() {
  return {
    balita: (body) => {
      const required = ['nama', 'tanggalLahir', 'jenisKelamin', 'namaOrtu', 'alamat', 'noTelp'];
      const missing = required.filter((k) => !requireString(body[k]));
      if (missing.length) {
        return { error: 'Field wajib tidak lengkap', details: { missing } };
      }
      return {
        value: {
          nama: body.nama.trim(),
          tanggalLahir: body.tanggalLahir,
          jenisKelamin: body.jenisKelamin,
          namaOrtu: body.namaOrtu.trim(),
          alamat: body.alamat.trim(),
          noTelp: body.noTelp.trim(),
        },
      };
    },
    ibuHamil: (body) => {
      const required = ['nama', 'tanggalLahir', 'alamat', 'noTelp'];
      const missing = required.filter((k) => !requireString(body[k]));
      if (missing.length) {
        return { error: 'Field wajib tidak lengkap', details: { missing } };
      }
      const usiaKehamilan = body.usiaKehamilan;
      if (usiaKehamilan !== undefined && typeof usiaKehamilan !== 'number') {
        return { error: 'Field `usiaKehamilan` harus number (bulan)' };
      }
      return {
        value: {
          nama: body.nama.trim(),
          tanggalLahir: body.tanggalLahir,
          alamat: body.alamat.trim(),
          noTelp: body.noTelp.trim(),
          usiaKehamilan: usiaKehamilan ?? null,
        },
      };
    },
    lansia: (body) => {
      const required = ['nama', 'tanggalLahir', 'jenisKelamin', 'alamat', 'noTelp'];
      const missing = required.filter((k) => !requireString(body[k]));
      if (missing.length) {
        return { error: 'Field wajib tidak lengkap', details: { missing } };
      }
      return {
        value: {
          nama: body.nama.trim(),
          tanggalLahir: body.tanggalLahir,
          jenisKelamin: body.jenisKelamin,
          alamat: body.alamat.trim(),
          noTelp: body.noTelp.trim(),
        },
      };
    },
  };
}

function buildRoutes() {
  const router = express.Router();

  router.get('/health', (req, res) => {
    res.json({ ok: true, service: 'posyandu-digital-api', time: nowIso() });
  });

  const n = normalizers();

  router.use(
    '/balita',
    createCrudRouter({
      entityKey: 'balita',
      entityName: 'balita',
      createNormalizer: n.balita,
    })
  );

  router.use(
    '/ibu-hamil',
    createCrudRouter({
      entityKey: 'ibuHamil',
      entityName: 'ibuHamil',
      createNormalizer: n.ibuHamil,
    })
  );

  router.use(
    '/lansia',
    createCrudRouter({
      entityKey: 'lansia',
      entityName: 'lansia',
      createNormalizer: n.lansia,
    })
  );

  return router;
}

module.exports = { buildRoutes };
