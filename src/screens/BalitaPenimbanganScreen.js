import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

export default function BalitaPenimbanganScreen({ route, navigation }) {
  const { balita } = route.params;
  const { addBalitaPenimbangan } = useData();

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    beratBadan: '',
    tinggiBadan: '',
    statusBB: 'Normal',
    statusTB: 'Normal',
    kehadiran: true,
  });

  const calculateAge = () => {
    const today = new Date();
    const birth = new Date(balita.tanggalLahir);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                   (today.getMonth() - birth.getMonth());
    return Math.floor(months);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBB = (berat, usia) => {
    // Simplified BMI calculation for demo
    // In real app, use WHO growth charts
    if (berat < 10) return 'Kurang';
    if (berat > 18) return 'Berlebih';
    return 'Normal';
  };

  const getStatusTB = (tinggi, usia) => {
    // Simplified height status for demo
    if (tinggi < 70) return 'Kurang';
    if (tinggi > 100) return 'Berlebih';
    return 'Normal';
  };

  const handleBeratChange = (value) => {
    handleInputChange('beratBadan', value);
    if (value) {
      const usia = calculateAge();
      const status = getStatusBB(parseFloat(value), usia);
      handleInputChange('statusBB', status);
    }
  };

  const handleTinggiChange = (value) => {
    handleInputChange('tinggiBadan', value);
    if (value) {
      const usia = calculateAge();
      const status = getStatusTB(parseFloat(value), usia);
      handleInputChange('statusTB', status);
    }
  };

  const validateForm = () => {
    if (!formData.beratBadan || !formData.tinggiBadan) {
      Alert.alert('Error', 'Berat badan dan tinggi badan harus diisi');
      return false;
    }

    if (isNaN(parseFloat(formData.beratBadan)) || isNaN(parseFloat(formData.tinggiBadan))) {
      Alert.alert('Error', 'Berat badan dan tinggi badan harus berupa angka');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const penimbanganData = {
          ...formData,
          usia: calculateAge(),
          beratBadan: parseFloat(formData.beratBadan),
          tinggiBadan: parseFloat(formData.tinggiBadan),
        };

        await addBalitaPenimbangan(balita.id, penimbanganData);
        
        Alert.alert(
          'Berhasil',
          'Data penimbangan berhasil disimpan',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        Alert.alert('Error', error?.message || 'Gagal menyimpan data penimbangan');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Ionicons 
              name={balita.jenisKelamin === 'Laki-laki' ? 'man' : 'woman'} 
              size={32} 
              color="#4A90E2" 
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{balita.nama}</Text>
            <Text style={styles.profileAge}>Usia: {calculateAge()} bulan</Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        {/* Tanggal */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal Penimbangan</Text>
          <View style={styles.dateDisplay}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateText}>{formatDate(formData.tanggal)}</Text>
          </View>
        </View>

        {/* Kehadiran */}
        <View style={styles.inputGroup}>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Status Kehadiran</Text>
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: formData.kehadiran ? '#27AE60' : '#E74C3C' }]}>
                {formData.kehadiran ? 'Hadir' : 'Tidak Hadir'}
              </Text>
              <Switch
                value={formData.kehadiran}
                onValueChange={(value) => handleInputChange('kehadiran', value)}
                trackColor={{ false: '#E74C3C', true: '#27AE60' }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {formData.kehadiran && (
          <>
            {/* Berat Badan */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Berat Badan (kg) *</Text>
              <TextInput
                style={styles.input}
                value={formData.beratBadan}
                onChangeText={handleBeratChange}
                placeholder="Masukkan berat badan"
                keyboardType="decimal-pad"
              />
              {formData.beratBadan && (
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <View style={[styles.statusBadge, getStatusStyle(formData.statusBB)]}>
                    <Text style={[styles.statusText, { color: getStatusStyle(formData.statusBB).color }]}>
                      {formData.statusBB}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Tinggi Badan */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tinggi Badan (cm) *</Text>
              <TextInput
                style={styles.input}
                value={formData.tinggiBadan}
                onChangeText={handleTinggiChange}
                placeholder="Masukkan tinggi badan"
                keyboardType="decimal-pad"
              />
              {formData.tinggiBadan && (
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <View style={[styles.statusBadge, getStatusStyle(formData.statusTB)]}>
                    <Text style={[styles.statusText, { color: getStatusStyle(formData.statusTB).color }]}>
                      {formData.statusTB}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* BMI Information */}
            {formData.beratBadan && formData.tinggiBadan && (
              <View style={styles.bmiContainer}>
                <Text style={styles.bmiTitle}>Informasi Tambahan</Text>
                <View style={styles.bmiRow}>
                  <Text style={styles.bmiLabel}>Usia saat ditimbang:</Text>
                  <Text style={styles.bmiValue}>{calculateAge()} bulan</Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, !formData.kehadiran && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={!formData.kehadiran}
        >
          <Ionicons name="save-outline" size={20} color="white" />
          <Text style={styles.submitButtonText}>Simpan Data Penimbangan</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'normal':
      return { backgroundColor: '#E8F5E8', color: '#27AE60' };
    case 'kurang':
      return { backgroundColor: '#FDEAEA', color: '#E74C3C' };
    case 'berlebih':
      return { backgroundColor: '#FEF3E2', color: '#F39C12' };
    default:
      return { backgroundColor: '#F5F5F5', color: '#95A5A6' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  dateDisplay: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  switchContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bmiContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bmiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  bmiLabel: {
    fontSize: 14,
    color: '#666',
  },
  bmiValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});