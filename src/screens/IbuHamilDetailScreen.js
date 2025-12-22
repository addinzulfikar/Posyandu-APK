import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, InfoRow, SectionHeader } from '../components/CommonComponents';
import { Badge } from '../components/CommonComponentsExtended';
import { 
  calculateAgeInYears, 
  formatDate, 
  getLatestPenimbangan 
} from '../utils/chartHelper';

export default function IbuHamilDetailScreen({ route, navigation }) {
  const { ibuHamil } = route.params;
  const [activeTab, setActiveTab] = useState('info');

  const age = calculateAgeInYears(ibuHamil.tanggalLahir);
  const latestData = getLatestPenimbangan(ibuHamil.riwayatPenimbangan);

  const renderInfoTab = () => (
    <ScrollView style={styles.tabContent}>
      <Card>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Ionicons name="woman" size={48} color="#E74C3C" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{ibuHamil.nama}</Text>
            <Text style={styles.ageText}>{age} tahun</Text>
            <View style={styles.pregnancyBadge}>
              <Ionicons name="heart" size={16} color="#E74C3C" />
              <Text style={styles.pregnancyText}>
                Hamil {ibuHamil.usiaKehamilan} bulan
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <SectionHeader title="Informasi Pribadi" />
      <Card>
        <InfoRow label="Tanggal Lahir" value={formatDate(ibuHamil.tanggalLahir)} icon="calendar-outline" />
        <InfoRow label="Usia" value={`${age} tahun`} icon="time-outline" />
        <InfoRow label="Usia Kehamilan" value={`${ibuHamil.usiaKehamilan} bulan`} icon="heart-outline" />
        <InfoRow label="Alamat" value={ibuHamil.alamat} icon="location-outline" />
        <InfoRow label="No. Telp" value={ibuHamil.noTelp || '-'} icon="call-outline" />
      </Card>

      {latestData && (
        <>
          <SectionHeader title="Data Pemeriksaan Terakhir" />
          <Card>
            <InfoRow label="Tanggal" value={formatDate(latestData.tanggal)} icon="calendar-outline" />
            <InfoRow label="Berat Badan" value={`${latestData.beratBadan} kg`} icon="fitness-outline" />
            <InfoRow label="Tinggi Badan" value={`${latestData.tinggiBadan} cm`} icon="resize-outline" />
            <InfoRow label="Tekanan Darah" value={latestData.tekananDarah || '-'} icon="pulse-outline" />
            
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

      {/* Info Kehamilan */}
      <SectionHeader title="Informasi Kehamilan" />
      <Card>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#E74C3C" />
          <View style={styles.infoBoxContent}>
            <Text style={styles.infoBoxTitle}>Trimester Kehamilan</Text>
            <Text style={styles.infoBoxText}>
              {ibuHamil.usiaKehamilan <= 3 ? 'Trimester 1 (Bulan 1-3)' : 
               ibuHamil.usiaKehamilan <= 6 ? 'Trimester 2 (Bulan 4-6)' : 
               'Trimester 3 (Bulan 7-9)'}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );

  const renderRiwayatTab = () => (
    <ScrollView style={styles.tabContent}>
      <SectionHeader 
        title="Riwayat Pemeriksaan" 
        subtitle={`${ibuHamil.riwayatPenimbangan?.length || 0} kali pemeriksaan`}
        action={() => navigation.navigate('IbuHamilPenimbangan', { ibuHamil })}
        actionText="+ Tambah"
      />
      
      {ibuHamil.riwayatPenimbangan && ibuHamil.riwayatPenimbangan.length > 0 ? (
        [...ibuHamil.riwayatPenimbangan].reverse().map((item, index) => (
          <Card key={index}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Pemeriksaan #{ibuHamil.riwayatPenimbangan.length - index}
              </Text>
              <Badge 
                text={item.kehadiran ? 'Hadir' : 'Tidak'} 
                variant={item.kehadiran ? 'success' : 'danger'} 
              />
            </View>
            <InfoRow label="Tanggal" value={formatDate(item.tanggal)} icon="calendar-outline" />
            <InfoRow label="Berat Badan" value={`${item.beratBadan} kg`} icon="fitness-outline" />
            <InfoRow label="Tinggi Badan" value={`${item.tinggiBadan} cm`} icon="resize-outline" />
            {item.tekananDarah && (
              <InfoRow label="Tekanan Darah" value={item.tekananDarah} icon="pulse-outline" />
            )}
            
            {/* Status Tekanan Darah */}
            {item.tekananDarah && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status Tekanan Darah:</Text>
                <Badge 
                  text={getTekananDarahStatus(item.tekananDarah)} 
                  variant={getTekananDarahVariant(item.tekananDarah)} 
                />
              </View>
            )}
          </Card>
        ))
      ) : (
        <Card>
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada riwayat pemeriksaan</Text>
            <Text style={styles.emptySubtext}>Tekan tombol + di atas untuk menambah data pemeriksaan</Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );

  const getTekananDarahStatus = (tensi) => {
    if (!tensi) return 'Tidak Ada Data';
    const [sistolik, diastolik] = tensi.split('/').map(v => parseInt(v));
    
    if (sistolik < 90 || diastolik < 60) return 'Rendah';
    if (sistolik > 140 || diastolik > 90) return 'Tinggi';
    if (sistolik > 120 || diastolik > 80) return 'Pre-Hipertensi';
    return 'Normal';
  };

  const getTekananDarahVariant = (tensi) => {
    const status = getTekananDarahStatus(tensi);
    if (status === 'Normal') return 'success';
    if (status === 'Pre-Hipertensi') return 'warning';
    return 'danger';
  };

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
            color={activeTab === 'info' ? '#E74C3C' : '#666'} 
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
            color={activeTab === 'riwayat' ? '#E74C3C' : '#666'} 
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
          onPress={() => navigation.navigate('IbuHamilPenimbangan', { ibuHamil })}
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
    borderBottomColor: '#E74C3C',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E74C3C',
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
    backgroundColor: '#FDEAEA',
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
    color: '#E74C3C',
    fontWeight: '600',
    marginBottom: 8,
  },
  pregnancyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  pregnancyText: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '600',
    marginLeft: 6,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  infoBoxContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
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
    paddingHorizontal: 20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#E74C3C',
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
