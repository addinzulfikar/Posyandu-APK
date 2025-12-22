import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, InfoRow, SectionHeader } from '../components/CommonComponents';
import { useData } from '../context/DataContext';
import { calculateAgeInYears, formatDate, getLatestPenimbangan } from '../utils/chartHelper';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth <= 480;

export default function LansiaListScreen({ navigation }) {
  const { lansiaData, refreshAll } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshAll?.();
    }, [refreshAll])
  );

  const filteredData = lansiaData.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLansiaItem = ({ item }) => {
    const age = calculateAgeInYears(item.tanggalLahir);
    const latestData = getLatestPenimbangan(item.riwayatPenimbangan);

    return (
      <Card onPress={() => navigation.navigate('LansiaDetail', { lansia: item })}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons 
              name={item.jenisKelamin === 'Laki-laki' ? 'man' : 'woman'} 
              size={32} 
              color="#27AE60" 
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.itemName}>{item.nama}</Text>
            <Text style={styles.itemAge}>{age} tahun</Text>
          </View>
        </View>
        
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

        <InfoRow 
          label="No. Telp" 
          value={item.noTelp || '-'} 
          icon="call-outline" 
        />

        {latestData && (
          <View style={styles.latestDataContainer}>
            <Text style={styles.latestDataTitle}>Data Terakhir ({formatDate(latestData.tanggal)}):</Text>
            <View style={styles.latestDataRow}>
              <Text style={styles.latestDataText}>
                BB: {latestData.beratBadan} kg | Tensi: {latestData.tensi || '-'}
              </Text>
            </View>
            <View style={styles.latestDataRow}>
              <Text style={styles.latestDataText}>
                Gula Darah: {latestData.gulaDarah || '-'} mg/dL
              </Text>
            </View>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.recordCount}>
            {item.riwayatPenimbangan?.length || 0} kali pemeriksaan
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title={`Data Lansia (${filteredData.length})`}
        onAddPress={() => navigation.navigate('LansiaForm')}
        addButtonTitle="Tambah Lansia"
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama lansia..."
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
        renderItem={renderLansiaItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="accessibility-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Tidak ada data yang sesuai' : 'Belum ada data lansia'}
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
    shadowOffset: { width: 0, height: 1 },
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
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemAge: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '600',
    marginTop: 2,
  },
  latestDataContainer: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  latestDataTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
  },
  latestDataRow: {
    marginTop: 4,
  },
  latestDataText: {
    fontSize: 14,
    color: '#27AE60',
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
    fontSize: 13,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
