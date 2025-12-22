import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, InfoRow, SectionHeader } from '../components/CommonComponents';
import { useData } from '../context/DataContext';
import { useFocusEffect } from '@react-navigation/native';

export default function IbuHamilListScreen({ navigation }) {
  const { ibuHamilData, refreshAll } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshAll?.();
    }, [refreshAll])
  );

  const filteredData = ibuHamilData.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const getLatestWeight = (riwayat) => {
    if (!riwayat || riwayat.length === 0) return null;
    return riwayat[riwayat.length - 1];
  };

  const renderIbuHamilItem = ({ item }) => {
    const age = calculateAge(item.tanggalLahir);
    const latestData = getLatestWeight(item.riwayatPenimbangan);

    return (
      <Card onPress={() => navigation.navigate('IbuHamilDetail', { ibuHamil: item })}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{item.nama}</Text>
          <Text style={styles.itemAge}>{age} tahun</Text>
        </View>
        
        <InfoRow 
          label="Usia Kehamilan" 
          value={`${item.usiaKehamilan} bulan`} 
          icon="heart-outline" 
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
            {latestData.tekananDarah && (
              <Text style={styles.latestDataText}>
                Tensi: {latestData.tekananDarah}
              </Text>
            )}
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.recordCount}>
            {item.riwayatPenimbangan.length} kali pemeriksaan
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title={`Data Ibu Hamil (${filteredData.length})`}
        onAddPress={() => navigation.navigate('IbuHamilForm')}
        addButtonTitle="Tambah Data"
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama ibu hamil..."
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
        renderItem={renderIbuHamilItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="woman-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Tidak ada data yang sesuai' : 'Belum ada data ibu hamil'}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemAge: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '600',
    backgroundColor: '#FDEAEA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  latestDataContainer: {
    backgroundColor: '#fff0f0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  latestDataTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  latestDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  latestDataText: {
    fontSize: 14,
    color: '#E74C3C',
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
    fontSize: 12,
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