import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, InfoRow, SectionHeader } from '../components/CommonComponents';
import { Badge } from '../components/CommonComponentsExtended';
import { useData } from '../context/DataContext';
import { 
  calculateAgeInYears, 
  formatDate, 
  getLatestPenimbangan,
  getStatusBadgeVariant 
} from '../utils/chartHelper';

export default function LansiaDetailScreen({ route, navigation }) {
  const { lansia } = route.params;
  const [activeTab, setActiveTab] = useState('info');

  const age = calculateAgeInYears(lansia.tanggalLahir);
  const latestData = getLatestPenimbangan(lansia.riwayatPenimbangan);

  const renderInfoTab = () => (
    <ScrollView style={styles.tabContent}>
      <Card>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Ionicons 
              name={lansia.jenisKelamin === 'Laki-laki' ? 'man' : 'woman'} 
              size={48} 
              color="#27AE60" 
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{lansia.nama}</Text>
            <Text style={styles.ageText}>{age} tahun</Text>
          </View>
        </View>
      </Card>

      <SectionHeader title="Informasi Pribadi" />
      <Card>
        <InfoRow label="Tanggal Lahir" value={formatDate(lansia.tanggalLahir)} icon="calendar-outline" />
        <InfoRow label="Jenis Kelamin" value={lansia.jenisKelamin} icon="person-outline" />
        <InfoRow label="Alamat" value={lansia.alamat} icon="location-outline" />
        <InfoRow label="No. Telp" value={lansia.noTelp || '-'} icon="call-outline" />
      </Card>

      {latestData && (
        <>
          <SectionHeader title="Data Pemeriksaan Terakhir" />
          <Card>
            <InfoRow label="Tanggal" value={formatDate(latestData.tanggal)} icon="calendar-outline" />
            <InfoRow label="Berat Badan" value={`${latestData.beratBadan} kg`} icon="fitness-outline" />
            <InfoRow label="Tinggi Badan" value={`${latestData.tinggiBadan} cm`} icon="resize-outline" />
            <InfoRow label="Tensi" value={latestData.tensi || '-'} icon="pulse-outline" />
            <InfoRow label="Gula Darah" value={latestData.gulaDarah ? `${latestData.gulaDarah} mg/dL` : '-'} icon="water-outline" />
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Kehadiran:</Text>
              <Badge 
                text={latestData.kehadiran ? 'Hadir' : 'Tidak Hadir'} 
                variant={latestData.kehadiran ? 'success' : 'danger'} 
              />
            </View>
          </Card>
        </>
      )}
    </ScrollView>
  );

  const renderRiwayatTab = () => (
    <ScrollView style={styles.tabContent}>
      <SectionHeader 
        title="Riwayat Pemeriksaan" 
        subtitle={`${lansia.riwayatPenimbangan?.length || 0} kali pemeriksaan`}
        action={() => navigation.navigate('LansiaPenimbangan', { lansia })}
        actionText="+ Tambah"
      />
      
      {lansia.riwayatPenimbangan && lansia.riwayatPenimbangan.length > 0 ? (
        [...lansia.riwayatPenimbangan].reverse().map((item, index) => (
          <Card key={index}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Pemeriksaan #{lansia.riwayatPenimbangan.length - index}
              </Text>
              <Badge 
                text={item.kehadiran ? 'Hadir' : 'Tidak'} 
                variant={item.kehadiran ? 'success' : 'danger'} 
              />
            </View>
            <InfoRow label="Tanggal" value={formatDate(item.tanggal)} icon="calendar-outline" />
            <InfoRow label="Berat Badan" value={`${item.beratBadan} kg`} icon="fitness-outline" />
            <InfoRow label="Tinggi Badan" value={`${item.tinggiBadan} cm`} icon="resize-outline" />
            <InfoRow label="Tensi" value={item.tensi || '-'} icon="pulse-outline" />
            <InfoRow label="Gula Darah" value={item.gulaDarah ? `${item.gulaDarah} mg/dL` : '-'} icon="water-outline" />
          </Card>
        ))
      ) : (
        <Card>
          <Text style={styles.emptyText}>Belum ada riwayat pemeriksaan</Text>
        </Card>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={activeTab === 'info' ? '#27AE60' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Informasi
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'riwayat' && styles.activeTab]}
          onPress={() => setActiveTab('riwayat')}
        >
          <Ionicons 
            name="time-outline" 
            size={20} 
            color={activeTab === 'riwayat' ? '#27AE60' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'riwayat' && styles.activeTabText]}>
            Riwayat
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'info' ? renderInfoTab() : renderRiwayatTab()}

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('LansiaPenimbangan', { lansia })}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.floatingButtonText}>Pemeriksaan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#27AE60',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#27AE60',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ageText: {
    fontSize: 16,
    color: '#27AE60',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginRight: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#27AE60',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
