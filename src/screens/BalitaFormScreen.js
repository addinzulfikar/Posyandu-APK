import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useData } from '../context/DataContext';
import { FormContainer } from '../components/ResponsiveLayout';

export default function BalitaFormScreen({ navigation, route }) {
  const { addBalita } = useData();
  const isEdit = route.params?.isEdit;
  const existingData = route.params?.balita;

  const [formData, setFormData] = useState({
    nama: existingData?.nama || '',
    tanggalLahir: existingData?.tanggalLahir || new Date().toISOString().split('T')[0],
    jenisKelamin: existingData?.jenisKelamin || 'Laki-laki',
    namaOrtu: existingData?.namaOrtu || '',
    alamat: existingData?.alamat || '',
    noTelp: existingData?.noTelp || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleInputChange('tanggalLahir', dateString);
    }
  };

  const validateForm = () => {
    const requiredFields = ['nama', 'tanggalLahir', 'jenisKelamin', 'namaOrtu', 'alamat'];
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Field ${field.replace(/([A-Z])/g, ' $1')} harus diisi`);
        return false;
      }
    }

    // Validate phone number if provided
    if (formData.noTelp && !/^08\d{8,11}$/.test(formData.noTelp)) {
      Alert.alert('Error', 'Format nomor telepon tidak valid (gunakan format 08xxxxxxxxx)');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await addBalita(formData);
        Alert.alert(
          'Berhasil',
          'Data balita berhasil disimpan',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        Alert.alert('Error', error?.message || 'Gagal menyimpan data');
      }
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
      <FormContainer>
        {/* Nama Balita */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Lengkap *</Text>
          <TextInput
            style={styles.input}
            value={formData.nama}
            onChangeText={(value) => handleInputChange('nama', value)}
            placeholder="Masukkan nama lengkap balita"
            autoCapitalize="words"
          />
        </View>

        {/* Tanggal Lahir */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal Lahir *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formatDateForDisplay(formData.tanggalLahir)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.tanggalLahir)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Jenis Kelamin */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jenis Kelamin *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.jenisKelamin === 'Laki-laki' && styles.genderButtonActive
              ]}
              onPress={() => handleInputChange('jenisKelamin', 'Laki-laki')}
            >
              <Ionicons 
                name="man" 
                size={20} 
                color={formData.jenisKelamin === 'Laki-laki' ? 'white' : '#666'} 
              />
              <Text style={[
                styles.genderButtonText,
                formData.jenisKelamin === 'Laki-laki' && styles.genderButtonTextActive
              ]}>
                Laki-laki
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.jenisKelamin === 'Perempuan' && styles.genderButtonActive
              ]}
              onPress={() => handleInputChange('jenisKelamin', 'Perempuan')}
            >
              <Ionicons 
                name="woman" 
                size={20} 
                color={formData.jenisKelamin === 'Perempuan' ? 'white' : '#666'} 
              />
              <Text style={[
                styles.genderButtonText,
                formData.jenisKelamin === 'Perempuan' && styles.genderButtonTextActive
              ]}>
                Perempuan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nama Orang Tua */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Orang Tua *</Text>
          <TextInput
            style={styles.input}
            value={formData.namaOrtu}
            onChangeText={(value) => handleInputChange('namaOrtu', value)}
            placeholder="Masukkan nama orang tua/wali"
            autoCapitalize="words"
          />
        </View>

        {/* Alamat */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alamat *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.alamat}
            onChangeText={(value) => handleInputChange('alamat', value)}
            placeholder="Masukkan alamat lengkap"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Nomor Telepon */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            value={formData.noTelp}
            onChangeText={(value) => handleInputChange('noTelp', value)}
            placeholder="08xxxxxxxxx"
            keyboardType="phone-pad"
          />
          <Text style={styles.hint}>Format: 08xxxxxxxxx (opsional)</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="save-outline" size={20} color="white" />
          <Text style={styles.submitButtonText}>
            {isEdit ? 'Update Data' : 'Simpan Data'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </FormContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 18,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  dateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  genderButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  genderButtonText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
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
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});