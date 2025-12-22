import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, InfoRow, SectionHeader } from '../components/CommonComponents';
import { useData } from '../context/DataContext';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth <= 480;

export default function BalitaListScreen({ navigation }) {
  const { balitaData, refreshAll } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshAll?.();
    }, [refreshAll])
  );

  const filteredData = balitaData.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.namaOrtu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                   (today.getMonth() - birth.getMonth());
    return Math.floor(months);
  };

  const getLatestWeight = (riwayat) => {
    if (!riwayat || riwayat.length === 0) return null;
    return riwayat[riwayat.length - 1];
  };

  const renderBalitaItem = ({ item }) => {
    const age = calculateAge(item.tanggalLahir);
    const latestData = getLatestWeight(item.riwayatPenimbangan);

    return (
      <Card onPress={() => navigation.navigate('BalitaDetail', { balita: item })}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{item.nama}</Text>
          <Text style={styles.itemAge}>{age} bulan</Text>
        </View>
        
        <InfoRow 
          label="Orang Tua" 
          value={item.namaOrtu} 
          icon="people-outline" 
        />
        
        <InfoRow 
          label="Jenis Kelamin" 
          value={item.jenisKelamin} 
          icon="person-outline" 
        />

        <InfoRow 
          label="Alamat" 
          value={item.alamat} 
          icon="location-outline" 
        />

        {latestData && (
          <View style={styles.latestDataContainer}>
            <Text style={styles.latestDataTitle}>Data Terakhir:</Text>
            <View style={styles.latestDataRow}>
              <Text style={styles.latestDataText}>
                BB: {latestData.beratBadan} kg | TB: {latestData.tinggiBadan} cm
              </Text>
            </View>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.recordCount}>
            {item.riwayatPenimbangan.length} kali penimbangan
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title={`Data Balita (${filteredData.length})`}
        onAddPress={() => navigation.navigate('BalitaForm')}
        addButtonTitle="Tambah Balita"
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama balita atau orang tua..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderBalitaItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        numColumns={!isMobile && screenWidth > 1024 ? 2 : 1}
        key={isMobile ? 'mobile' : 'desktop'}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Tidak ada data yang sesuai' : 'Belum ada data balita'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Coba kata kunci lain' : 'Tekan tombol + untuk menambah data'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemAge: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  latestDataContainer: {
    backgroundColor: '#f0f7ff',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  latestDataTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
  },
  latestDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  latestDataText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  recordCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },

});