import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { apiRequest } from '../utils/apiClient';

// Sample data untuk testing
const sampleBalita = [
  {
    id: '1',
    nama: 'Ahmad Rizki',
    tanggalLahir: '2022-03-15',
    jenisKelamin: 'Laki-laki',
    namaOrtu: 'Siti Aminah',
    alamat: 'Jl. Merdeka No. 12',
    noTelp: '08123456789',
    riwayatPenimbangan: [
      {
        id: '1',
        tanggal: '2024-11-01',
        usia: 32, // bulan
        beratBadan: 12.5,
        tinggiBadan: 85,
        statusBB: 'Normal',
        statusTB: 'Normal',
        kehadiran: true
      }
    ]
  },
  {
    id: '2',
    nama: 'Sari Dewi',
    tanggalLahir: '2021-08-22',
    jenisKelamin: 'Perempuan',
    namaOrtu: 'Budiman Santoso',
    alamat: 'Jl. Kenanga No. 5',
    noTelp: '08987654321',
    riwayatPenimbangan: []
  }
];

const sampleIbuHamil = [
  {
    id: '1',
    nama: 'Rina Kusuma',
    tanggalLahir: '1995-06-10',
    alamat: 'Jl. Melati No. 8',
    noTelp: '08111222333',
    usiaKehamilan: 7, // bulan
    riwayatPenimbangan: [
      {
        id: '1',
        tanggal: '2024-11-01',
        beratBadan: 65,
        tinggiBadan: 158,
        tekananDarah: '120/80',
        kehadiran: true
      }
    ]
  }
];

const sampleLansia = [
  {
    id: '1',
    nama: 'Pak Slamet',
    tanggalLahir: '1950-12-05',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Dahlia No. 15',
    noTelp: '08555666777',
    riwayatPenimbangan: [
      {
        id: '1',
        tanggal: '2024-11-01',
        beratBadan: 68,
        tinggiBadan: 165,
        tensi: '130/85',
        gulaDarah: 120,
        kehadiran: true
      }
    ]
  }
];

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [balitaData, setBalitaData] = useState(sampleBalita);
  const [ibuHamilData, setIbuHamilData] = useState(sampleIbuHamil);
  const [lansiaData, setLansiaData] = useState(sampleLansia);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const refreshInFlightRef = useRef(false);

  const POLL_INTERVAL_MS = 5000;

  const loadAll = useCallback(async (options = {}) => {
    const silent = options?.silent === true;
    if (!silent) setIsLoading(true);
    setApiError(null);
    try {
      const [balita, ibuHamil, lansia] = await Promise.all([
        apiRequest('/balita'),
        apiRequest('/ibu-hamil'),
        apiRequest('/lansia'),
      ]);
      setBalitaData(Array.isArray(balita) ? balita : []);
      setIbuHamilData(Array.isArray(ibuHamil) ? ibuHamil : []);
      setLansiaData(Array.isArray(lansia) ? lansia : []);
    } catch (e) {
      setApiError(e);
      // Fallback supaya app tetap bisa dipakai walau API belum jalan.
      setBalitaData(sampleBalita);
      setIbuHamilData(sampleIbuHamil);
      setLansiaData(sampleLansia);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async (options = {}) => {
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    try {
      await loadAll(options);
    } finally {
      refreshInFlightRef.current = false;
    }
  }, [loadAll]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    let pollTimer = null;

    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval(() => {
        refreshAll({ silent: true });
      }, POLL_INTERVAL_MS);
    };

    const stopPolling = () => {
      if (!pollTimer) return;
      clearInterval(pollTimer);
      pollTimer = null;
    };

    if (AppState.currentState === 'active') {
      refreshAll({ silent: true });
      startPolling();
    }

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshAll({ silent: true });
        startPolling();
      } else {
        stopPolling();
      }
    });

    return () => {
      stopPolling();
      sub.remove();
    };
  }, [refreshAll]);

  // Balita functions (API)
  const addBalita = async (data) => {
    const created = await apiRequest('/balita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setBalitaData((prev) => [...prev, created]);
    return created;
  };

  const updateBalita = async (id, data) => {
    const updated = await apiRequest(`/balita/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setBalitaData((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const addBalitaPenimbangan = async (balitaId, data) => {
    const created = await apiRequest(`/balita/${balitaId}/penimbangan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // Refresh item supaya riwayatPenimbangan sinkron
    const refreshed = await apiRequest(`/balita/${balitaId}`);
    setBalitaData((prev) => prev.map((item) => (item.id === balitaId ? refreshed : item)));
    return created;
  };

  // Ibu Hamil functions (API)
  const addIbuHamil = async (data) => {
    const created = await apiRequest('/ibu-hamil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setIbuHamilData((prev) => [...prev, created]);
    return created;
  };

  const updateIbuHamil = async (id, data) => {
    const updated = await apiRequest(`/ibu-hamil/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setIbuHamilData((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const addIbuHamilPenimbangan = async (ibuHamilId, data) => {
    const created = await apiRequest(`/ibu-hamil/${ibuHamilId}/penimbangan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const refreshed = await apiRequest(`/ibu-hamil/${ibuHamilId}`);
    setIbuHamilData((prev) => prev.map((item) => (item.id === ibuHamilId ? refreshed : item)));
    return created;
  };

  // Lansia functions (API)
  const addLansia = async (data) => {
    const created = await apiRequest('/lansia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLansiaData((prev) => [...prev, created]);
    return created;
  };

  const updateLansia = async (id, data) => {
    const updated = await apiRequest(`/lansia/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLansiaData((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const addLansiaPenimbangan = async (lansiaId, data) => {
    const created = await apiRequest(`/lansia/${lansiaId}/penimbangan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const refreshed = await apiRequest(`/lansia/${lansiaId}`);
    setLansiaData((prev) => prev.map((item) => (item.id === lansiaId ? refreshed : item)));
    return created;
  };

  const value = useMemo(() => ({
    // Data
    balitaData,
    ibuHamilData,
    lansiaData,

    // Status
    isLoading,
    apiError,

    // Actions
    refreshAll,
    
    // Functions
    addBalita,
    updateBalita,
    addBalitaPenimbangan,
    addIbuHamil,
    updateIbuHamil,
    addIbuHamilPenimbangan,
    addLansia,
    updateLansia,
    addLansiaPenimbangan
  }), [
    balitaData,
    ibuHamilData,
    lansiaData,
    isLoading,
    apiError,
    refreshAll,
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};