import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Platform,
  TouchableOpacity 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/CommonComponents';
import { Input, Button } from '../components/CommonComponentsExtended';
import { useData } from '../context/DataContext';

export default function IbuHamilPenimbanganScreen({ navigation, route }) {
  const { ibuHamil } = route.params;
  const { addIbuHamilPenimbangan } = useData();

  const [formData, setFormData] = useState({
    tanggal: new Date(),
    beratBadan: '',
    tinggiBadan: '',
    tekananDarah: '',
    kehadiran: true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.beratBadan) {
      newErrors.beratBadan = 'Berat badan wajib diisi';
    } else {
      const bb = parseFloat(formData.beratBadan);
      if (isNaN(bb) || bb < 30 || bb > 150) {
        newErrors.beratBadan = 'Berat badan tidak valid (30-150 kg)';
      }
    }

    if (!formData.tinggiBadan) {
      newErrors.tinggiBadan = 'Tinggi badan wajib diisi';
    } else {
      const tb = parseFloat(formData.tinggiBadan);
      if (isNaN(tb) || tb < 100 || tb < 220) {
        newErrors.tinggiBadan = 'Tinggi badan tidak valid (100-220 cm)';
      }
    }

    // Validasi tekanan darah (opsional tapi jika diisi harus valid)
    if (formData.tekananDarah && formData.tekananDarah.trim() !== '') {
      const tensiRegex = /^\d{2,3}\/\d{2,3}$/;
      if (!tensiRegex.test(formData.tekananDarah)) {
        newErrors.tekananDarah = 'Format: 120/80';
      } else {
        const [sistolik, diastolik] = formData.tekananDarah.split('/').map(v => parseInt(v));
        if (sistolik < 60 || sistolik > 250 || diastolik < 40 || diastolik > 150) {
          newErrors.tekananDarah = 'Nilai tekanan darah tidak valid';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Mohon lengkapi semua field dengan benar');
      return;
    }

    const dataToSave = {
      tanggal: formData.tanggal.toISOString(),
      beratBadan: parseFloat(formData.beratBadan),
      tinggiBadan: parseFloat(formData.tinggiBadan),
      tekananDarah: formData.tekananDarah.trim() || null,
      kehadiran: formData.kehadiran,
    };

    try {
      await addIbuHamilPenimbangan(ibuHamil.id, dataToSave);
      Alert.alert('Berhasil', 'Data pemeriksaan berhasil ditambahkan', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]);
    } catch (error) {
      Alert.alert('Error', error?.message || 'Gagal menyimpan data');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, tanggal: selectedDate });
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTekananDarahStatus = () => {
    if (!formData.tekananDarah) return null;
    
    const tensiRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!tensiRegex.test(formData.tekananDarah)) return null;

    const [sistolik, diastolik] = formData.tekananDarah.split('/').map(v => parseInt(v));
    
    if (sistolik < 90 || diastolik < 60) {
      return { status: 'Rendah', color: '#FFC107', icon: 'arrow-down-circle' };
    }
    if (sistolik > 140 || diastolik > 90) {
      return { status: 'Tinggi (Hipertensi)', color: '#dc3545', icon: 'warning' };
    }
    if (sistolik > 120 || diastolik > 80) {
      return { status: 'Pre-Hipertensi', color: '#FF9800', icon: 'alert-circle' };
    }
    return { status: 'Normal', color: '#28a745', icon: 'checkmark-circle' };
  };

  const tekananDarahStatus = getTekananDarahStatus();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarSmall}>
          <Ionicons name="woman" size={32} color="#E74C3C" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{ibuHamil.nama}</Text>
          <Text style={styles.headerSubtext}>Hamil {ibuHamil.usiaKehamilan} bulan</Text>
        </View>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Data Pemeriksaan</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Ionicons name="calendar-outline" size={16} color="#666" /> Tanggal Pemeriksaan
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(formData.tanggal)}</Text>
            <Ionicons name="calendar" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.tanggal}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <Input
          label="Berat Badan (kg)"
          value={formData.beratBadan}
          onChangeText={(text) => setFormData({ ...formData, beratBadan: text })}
          placeholder="Contoh: 65.5"
          icon="fitness-outline"
          keyboardType="decimal-pad"
          error={errors.beratBadan}
        />

        <Input
          label="Tinggi Badan (cm)"
          value={formData.tinggiBadan}
          onChangeText={(text) => setFormData({ ...formData, tinggiBadan: text })}
          placeholder="Contoh: 160"
          icon="resize-outline"
          keyboardType="decimal-pad"
          error={errors.tinggiBadan}
        />

        <Input
          label="Tekanan Darah (Opsional)"
          value={formData.tekananDarah}
          onChangeText={(text) => setFormData({ ...formData, tekananDarah: text })}
          placeholder="Contoh: 120/80"
          icon="pulse-outline"
          keyboardType="numeric"
          error={errors.tekananDarah}
        />

        <View style={styles.helpBox}>
          <Ionicons name="information-circle" size={20} color="#E74C3C" />
          <Text style={styles.helpText}>
            Format tekanan darah: sistolik/diastolik (contoh: 120/80)
          </Text>
        </View>

        {/* Status Tekanan Darah */}
        {tekananDarahStatus && (
          <View style={[styles.statusCard, { borderLeftColor: tekananDarahStatus.color }]}>
            <Ionicons name={tekananDarahStatus.icon} size={32} color={tekananDarahStatus.color} />
            <View style={styles.statusContent}>
              <Text style={styles.statusLabel}>Status Tekanan Darah</Text>
              <Text style={[styles.statusValue, { color: tekananDarahStatus.color }]}>
                {tekananDarahStatus.status}
              </Text>
              {tekananDarahStatus.status === 'Tinggi (Hipertensi)' && (
                <Text style={styles.statusWarning}>
                  ⚠️ Perlu perhatian khusus. Konsultasikan dengan bidan atau dokter.
                </Text>
              )}
              {tekananDarahStatus.status === 'Pre-Hipertensi' && (
                <Text style={styles.statusWarning}>
                  ⚠️ Waspadai tekanan darah. Jaga pola makan dan istirahat.
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.toggleContainer}>
          <View style={styles.toggleLabel}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
            <Text style={styles.toggleText}>Status Kehadiran</Text>
          </View>
          <View style={styles.toggleButtons}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                formData.kehadiran && styles.toggleButtonActive
              ]}
              onPress={() => setFormData({ ...formData, kehadiran: true })}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={formData.kehadiran ? 'white' : '#28a745'} 
              />
              <Text style={[
                styles.toggleButtonText,
                formData.kehadiran && styles.toggleButtonTextActive
              ]}>
                Hadir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !formData.kehadiran && styles.toggleButtonInactive
              ]}
              onPress={() => setFormData({ ...formData, kehadiran: false })}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={!formData.kehadiran ? 'white' : '#dc3545'} 
              />
              <Text style={[
                styles.toggleButtonText,
                !formData.kehadiran && styles.toggleButtonTextActive
              ]}>
                Tidak Hadir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Info Pentingnya Pemantauan */}
      <Card>
        <View style={styles.infoCard}>
          <Ionicons name="heart-circle" size={28} color="#E74C3C" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Pentingnya Pemeriksaan Rutin</Text>
            <Text style={styles.infoText}>
              Pemeriksaan rutin ibu hamil sangat penting untuk memantau kesehatan ibu dan perkembangan janin. 
              Tekanan darah yang terkontrol membantu mencegah preeklampsia.
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          text="Batal"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
        <Button
          text="Simpan Data"
          onPress={handleSubmit}
          style={styles.button}
        />
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FDEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E74C3C',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 16,
  },
  helpText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  statusContent: {
    flex: 1,
    marginLeft: 12,
  },
  statusLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusWarning: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  toggleContainer: {
    marginTop: 8,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  toggleButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  toggleButtonInactive: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});
