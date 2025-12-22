// Helper functions untuk grafik pertumbuhan

export const getStatusBadgeVariant = (status) => {
  if (!status) return 'default';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('normal')) return 'success';
  if (statusLower.includes('kurang')) return 'danger';
  if (statusLower.includes('berlebih')) return 'warning';
  return 'default';
};

export const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += today.getMonth();
  return months <= 0 ? 0 : months;
};

export const calculateAgeInYears = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const prepareChartData = (riwayatPenimbangan, dataKey = 'beratBadan') => {
  if (!riwayatPenimbangan || riwayatPenimbangan.length === 0) {
    return {
      labels: ['Belum Ada Data'],
      datasets: [{
        data: [0]
      }]
    };
  }

  // Sort by date
  const sorted = [...riwayatPenimbangan].sort((a, b) => 
    new Date(a.tanggal) - new Date(b.tanggal)
  );

  return {
    labels: sorted.map(item => {
      const date = new Date(item.tanggal);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [{
      data: sorted.map(item => item[dataKey] || 0)
    }]
  };
};

export const getLatestPenimbangan = (riwayatPenimbangan) => {
  if (!riwayatPenimbangan || riwayatPenimbangan.length === 0) {
    return null;
  }
  
  const sorted = [...riwayatPenimbangan].sort((a, b) => 
    new Date(b.tanggal) - new Date(a.tanggal)
  );
  
  return sorted[0];
};

export const determineStatusBB = (beratBadan, usia, jenisKelamin) => {
  // Simplified logic - in real app, use WHO growth charts
  // This is just a placeholder
  if (!beratBadan || !usia) return 'Belum Ada Data';
  
  // Rough estimates for demonstration
  const idealWeight = jenisKelamin === 'Laki-laki' 
    ? 3.3 + (usia * 0.45)  // Rough estimate
    : 3.2 + (usia * 0.43); // Rough estimate
  
  const lowerBound = idealWeight * 0.85;
  const upperBound = idealWeight * 1.15;
  
  if (beratBadan < lowerBound) return 'Kurang';
  if (beratBadan > upperBound) return 'Berlebih';
  return 'Normal';
};

export const determineStatusTB = (tinggiBadan, usia, jenisKelamin) => {
  // Simplified logic - in real app, use WHO growth charts
  if (!tinggiBadan || !usia) return 'Belum Ada Data';
  
  // Rough estimates for demonstration
  const idealHeight = jenisKelamin === 'Laki-laki'
    ? 50 + (usia * 1.5)  // Rough estimate
    : 49.5 + (usia * 1.45); // Rough estimate
  
  const lowerBound = idealHeight * 0.92;
  const upperBound = idealHeight * 1.08;
  
  if (tinggiBadan < lowerBound) return 'Pendek';
  if (tinggiBadan > upperBound) return 'Tinggi';
  return 'Normal';
};
