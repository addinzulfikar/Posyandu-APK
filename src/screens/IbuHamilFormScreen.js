import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/CommonComponents';
import { Input, Button } from '../components/CommonComponentsExtended';
import { useData } from '../context/DataContext';

export default function IbuHamilFormScreen({ navigation, route }) {
  const { addIbuHamil, updateIbuHamil } = useData();
  const editMode = route.params?.ibuHamil ? true : false;
  const existingData = route.params?.ibuHamil || {};

  const [formData, setFormData] = useState({
    nama: existingData.nama || '',
    tanggalLahir: existingData.tanggalLahir || new Date(),
    usiaKehamilan: existingData.usiaKehamilan?.toString() || '',
    alamat: existingData.alamat || '',
    noTelp: existingData.noTelp || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    }

    if (!formData.usiaKehamilan) {
      newErrors.usiaKehamilan = 'Usia kehamilan wajib diisi';
    } else {
      const usiaKehamilan = parseInt(formData.usiaKehamilan);
      if (isNaN(usiaKehamilan) || usiaKehamilan < 1 || usiaKehamilan > 9) {
        newErrors.usiaKehamilan = 'Usia kehamilan harus antara 1-9 bulan';
      }
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    if (formData.noTelp && formData.noTelp.length > 0) {
      const phoneRegex = /^[0-9]{10,13}$/;
      if (!phoneRegex.test(formData.noTelp.replace(/\s/g, ''))) {
        newErrors.noTelp = 'Nomor telepon tidak valid (10-13 digit)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi dengan benar');
      return;
    }

    const dataToSave = {
      ...formData,
      usiaKehamilan: parseInt(formData.usiaKehamilan),
      tanggalLahir: formData.tanggalLahir.toISOString(),
    };

    try {
      if (editMode) {
        await updateIbuHamil(existingData.id, dataToSave);
        Alert.alert('Berhasil', 'Data ibu hamil berhasil diperbarui', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await addIbuHamil(dataToSave);
        Alert.alert('Berhasil', 'Data ibu hamil berhasil ditambahkan', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'Gagal menyimpan data');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, tanggalLahir: selectedDate });
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const usiaKehamilanOptions = [
    { value: 1, label: '1 Bulan (Trimester 1)' },
    { value: 2, label: '2 Bulan (Trimester 1)' },
    { value: 3, label: '3 Bulan (Trimester 1)' },
    { value: 4, label: '4 Bulan (Trimester 2)' },
    { value: 5, label: '5 Bulan (Trimester 2)' },
    { value: 6, label: '6 Bulan (Trimester 2)' },
    { value: 7, label: '7 Bulan (Trimester 3)' },
    { value: 8, label: '8 Bulan (Trimester 3)' },
    { value: 9, label: '9 Bulan (Trimester 3)' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
        
        <Input
          label="Nama Lengkap"
          value={formData.nama}
          onChangeText={(text) => setFormData({ ...formData, nama: text })}
          placeholder="Masukkan nama lengkap"
          icon="person-outline"
          error={errors.nama}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Ionicons name="calendar-outline" size={16} color="#666" /> Tanggal Lahir
          </Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.tanggalLahir && styles.inputError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(formData.tanggalLahir)}</Text>
            <Ionicons name="calendar" size={20} color="#E74C3C" />
          </TouchableOpacity>
          {errors.tanggalLahir && <Text style={styles.errorText}>{errors.tanggalLahir}</Text>}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.tanggalLahir}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <Input
          label="Alamat Lengkap"
          value={formData.alamat}
          onChangeText={(text) => setFormData({ ...formData, alamat: text })}
          placeholder="Masukkan alamat lengkap"
          icon="location-outline"
          multiline
          numberOfLines={3}
          error={errors.alamat}
        />

        <Input
          label="Nomor Telepon (Opsional)"
          value={formData.noTelp}
          onChangeText={(text) => setFormData({ ...formData, noTelp: text })}
          placeholder="08xxxxxxxxxx"
          icon="call-outline"
          keyboardType="phone-pad"
          error={errors.noTelp}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Informasi Kehamilan</Text>
        
        <Input
          label="Usia Kehamilan (Bulan)"
          value={formData.usiaKehamilan}
          onChangeText={(text) => setFormData({ ...formData, usiaKehamilan: text })}
          placeholder="1-9"
          icon="heart-outline"
          keyboardType="numeric"
          error={errors.usiaKehamilan}
        />

        <View style={styles.helpBox}>
          <Ionicons name="information-circle" size={20} color="#E74C3C" />
          <Text style={styles.helpText}>
            Masukkan usia kehamilan dalam bulan (1-9 bulan)
          </Text>
        </View>

        {/* Pilihan Cepat Usia Kehamilan */}
        <Text style={styles.quickSelectLabel}>Pilihan Cepat:</Text>
        <View style={styles.optionsGrid}>
          {usiaKehamilanOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                formData.usiaKehamilan === option.value.toString() && styles.optionButtonActive
              ]}
              onPress={() => setFormData({ ...formData, usiaKehamilan: option.value.toString() })}
            >
              <Text style={[
                styles.optionButtonText,
                formData.usiaKehamilan === option.value.toString() && styles.optionButtonTextActive
              ]}>
                {option.value} Bulan
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Informasi Trimester */}
        {formData.usiaKehamilan && parseInt(formData.usiaKehamilan) >= 1 && parseInt(formData.usiaKehamilan) <= 9 && (
          <View style={styles.trimesterInfo}>
            <Ionicons name="information-circle" size={24} color="#E74C3C" />
            <View style={styles.trimesterContent}>
              <Text style={styles.trimesterTitle}>
                {parseInt(formData.usiaKehamilan) <= 3 ? 'Trimester 1' :
                 parseInt(formData.usiaKehamilan) <= 6 ? 'Trimester 2' :
                 'Trimester 3'}
              </Text>
              <Text style={styles.trimesterText}>
                {parseInt(formData.usiaKehamilan) <= 3 ? 'Periode adaptasi dan pembentukan organ' :
                 parseInt(formData.usiaKehamilan) <= 6 ? 'Periode pertumbuhan dan perkembangan' :
                 'Periode persiapan kelahiran'}
              </Text>
            </View>
          </View>
        )}
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          text="Batal"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
        <Button
          text={editMode ? 'Simpan Perubahan' : 'Tambah Data'}
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
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  helpText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  quickSelectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    width: '31%',
    margin: '1%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
  },
  optionButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  trimesterInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  trimesterContent: {
    flex: 1,
    marginLeft: 12,
  },
  trimesterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
    marginBottom: 4,
  },
  trimesterText: {
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
