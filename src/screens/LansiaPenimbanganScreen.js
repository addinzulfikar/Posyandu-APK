import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useData } from '../context/DataContext';
import { calculateAgeInYears, formatDateForInput } from '../utils/chartHelper';

export default function LansiaPenimbanganScreen({ navigation, route }) {
  const { lansia } = route.params;
  const { addLansiaPenimbangan } = useData();
  
  const currentAge = calculateAgeInYears(lansia.tanggalLahir);

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    beratBadan: '',
    tinggiBadan: '',
    tensi: '',
    gulaDarah: '',
    kehadiran: true,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleInputChange('tanggal', dateString);
    }
  };

  const validateForm = () => {
    if (!formData.beratBadan || !formData.tinggiBadan) {
      Alert.alert('Error', 'Berat badan dan tinggi badan harus diisi');
      return false;
    }

    const bb = parseFloat(formData.beratBadan);
    const tb = parseFloat(formData.tinggiBadan);

    if (isNaN(bb) || bb <= 0 || bb > 200) {
      Alert.alert('Error', 'Berat badan tidak valid (0-200 kg)');
      return false;
    }

    if (isNaN(tb) || tb <= 0 || tb > 250) {
      Alert.alert('Error', 'Tinggi badan tidak valid (0-250 cm)');
      return false;
    }

    // Validate tensi format (optional)
    if (formData.tensi && !/^\d{2,3}\/\d{2,3}$/.test(formData.tensi)) {
      Alert.alert('Error', 'Format tekanan darah tidak valid (contoh: 120/80)');
      return false;
    }

    // Validate gula darah (optional)
    if (formData.gulaDarah) {
      const gd = parseFloat(formData.gulaDarah);
      if (isNaN(gd) || gd <= 0 || gd > 1000) {
        Alert.alert('Error', 'Nilai gula darah tidak valid');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const penimbanganData = {
      ...formData,
      beratBadan: parseFloat(formData.beratBadan),
      tinggiBadan: parseFloat(formData.tinggiBadan),
      gulaDarah: formData.gulaDarah ? parseFloat(formData.gulaDarah) : null,
    };

    try {
      await addLansiaPenimbangan(lansia.id, penimbanganData);
      Alert.alert(
        'Berhasil',
        'Data pemeriksaan berhasil disimpan',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', error?.message || 'Gagal menyimpan data');
    }
  };

  const formatDateForDisplay = (dateString) => {
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
        <View style={styles.avatarContainer}>
          <Ionicons 
            name={lansia.jenisKelamin === 'Laki-laki' ? 'man' : 'woman'} 
            size={40} 
            color="#27AE60" 
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{lansia.nama}</Text>
          <Text style={styles.headerAge}>Usia: {currentAge} tahun</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        {/* Tanggal Pemeriksaan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal Pemeriksaan *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
            <Text style={styles.dateText}>
              {formatDateForDisplay(formData.tanggal)}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.tanggal)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Berat Badan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Berat Badan (kg) *</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="fitness-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.beratBadan}
              onChangeText={(value) => handleInputChange('beratBadan', value)}
              placeholder="Contoh: 65.5"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Tinggi Badan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tinggi Badan (cm) *</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="resize-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.tinggiBadan}
              onChangeText={(value) => handleInputChange('tinggiBadan', value)}
              placeholder="Contoh: 165"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Tekanan Darah / Tensi */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tekanan Darah (Tensi)</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="pulse-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.tensi}
              onChangeText={(value) => handleInputChange('tensi', value)}
              placeholder="Contoh: 120/80"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <Text style={styles.hint}>Format: Sistolik/Diastolik (contoh: 120/80)</Text>
        </View>

        {/* Gula Darah */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gula Darah (mg/dL)</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="water-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.gulaDarah}
              onChangeText={(value) => handleInputChange('gulaDarah', value)}
              placeholder="Contoh: 95"
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.hint}>Kadar gula darah dalam miligram per desiliter</Text>
        </View>

        {/* Status Kehadiran */}
        <View style={styles.inputGroup}>
          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Ionicons 
                name={formData.kehadiran ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={formData.kehadiran ? "#27AE60" : "#E74C3C"} 
              />
              <Text style={styles.label}>Status Kehadiran</Text>
            </View>
            <Switch
              value={formData.kehadiran}
              onValueChange={(value) => handleInputChange('kehadiran', value)}
              trackColor={{ false: '#E74C3C', true: '#27AE60' }}
              thumbColor={'white'}
            />
          </View>
          <Text style={styles.hint}>
            {formData.kehadiran ? 'Lansia hadir pada pemeriksaan' : 'Lansia tidak hadir'}
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#27AE60" />
          <Text style={styles.infoText}>
            Tensi dan Gula Darah bersifat opsional. Dapat diisi jika dilakukan pemeriksaan.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="save-outline" size={22} color="white" />
          <Text style={styles.submitButtonText}>Simpan Data Pemeriksaan</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerAge: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  formContainer: {
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  dateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 30,
  },
});
