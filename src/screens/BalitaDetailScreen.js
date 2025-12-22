import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, InfoRow, StatusBadge } from '../components/CommonComponents';
import { spacing, fontSize, dimensions, responsive } from '../utils/responsive';

const { width } = Dimensions.get('window');

export default function BalitaDetailScreen({ route, navigation }) {
  const { balita } = route.params;
  const [activeTab, setActiveTab] = useState('info');

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                   (today.getMonth() - birth.getMonth());
    return Math.floor(months);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderInfoTab = () => (
    <ScrollView style={styles.tabContent}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons 
              name={balita.jenisKelamin === 'Laki-laki' ? 'man' : 'woman'} 
              size={responsive(40, 48, 52)} 
              color="#4A90E2" 
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{balita.nama}</Text>
            <Text style={styles.profileAge}>{calculateAge(balita.tanggalLahir)} bulan</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.cardTitle}>Informasi Pribadi</Text>
        <InfoRow label="Nama Lengkap" value={balita.nama} icon="person-outline" />
        <InfoRow label="Tanggal Lahir" value={formatDate(balita.tanggalLahir)} icon="calendar-outline" />
        <InfoRow label="Jenis Kelamin" value={balita.jenisKelamin} icon="people-outline" />
        <InfoRow label="Usia" value={`${calculateAge(balita.tanggalLahir)} bulan`} icon="time-outline" />
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.cardTitle}>Informasi Keluarga</Text>
        <InfoRow label="Nama Orang Tua" value={balita.namaOrtu} icon="people-outline" />
        <InfoRow label="Alamat" value={balita.alamat} icon="location-outline" />
        <InfoRow label="No. Telepon" value={balita.noTelp} icon="call-outline" />
      </Card>

      {balita.riwayatPenimbangan.length > 0 && (
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Data Terakhir</Text>
          {(() => {
            const latest = balita.riwayatPenimbangan[balita.riwayatPenimbangan.length - 1];
            return (
              <View>
                <InfoRow label="Tanggal Penimbangan" value={formatDate(latest.tanggal)} icon="calendar-outline" />
                <InfoRow label="Berat Badan" value={`${latest.beratBadan} kg`} icon="fitness-outline" />
                <InfoRow label="Tinggi Badan" value={`${latest.tinggiBadan} cm`} icon="resize-outline" />
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status BB:</Text>
                  <StatusBadge status={latest.statusBB} />
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status TB:</Text>
                  <StatusBadge status={latest.statusTB} />
                </View>
              </View>
            );
          })()}
        </Card>
      )}
    </ScrollView>
  );

  const renderGrafikTab = () => (
    <ScrollView style={styles.tabContent}>
      <Card style={styles.infoCard}>
        <Text style={styles.cardTitle}>Riwayat Penimbangan</Text>
        {balita.riwayatPenimbangan.length > 0 ? (
          balita.riwayatPenimbangan.map((item, index) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{formatDate(item.tanggal)}</Text>
                <Text style={styles.historyAge}>Usia: {item.usia} bulan</Text>
              </View>
              <View style={styles.historyData}>
                <View style={styles.historyDataItem}>
                  <Text style={styles.historyDataLabel}>Berat Badan</Text>
                  <Text style={styles.historyDataValue}>{item.beratBadan} kg</Text>
                  <StatusBadge status={item.statusBB} />
                </View>
                <View style={styles.historyDataItem}>
                  <Text style={styles.historyDataLabel}>Tinggi Badan</Text>
                  <Text style={styles.historyDataValue}>{item.tinggiBadan} cm</Text>
                  <StatusBadge status={item.statusTB} />
                </View>
              </View>
              <View style={styles.attendanceContainer}>
                <Ionicons 
                  name={item.kehadiran ? "checkmark-circle" : "close-circle"} 
                  size={16} 
                  color={item.kehadiran ? "#27AE60" : "#E74C3C"} 
                />
                <Text style={[styles.attendanceText, { color: item.kehadiran ? "#27AE60" : "#E74C3C" }]}>
                  {item.kehadiran ? "Hadir" : "Tidak Hadir"}
                </Text>
              </View>
              {index < balita.riwayatPenimbangan.length - 1 && <View style={styles.historyDivider} />}
            </View>
          ))
        ) : (
          <View style={styles.emptyHistory}>
            <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyHistoryText}>Belum ada data penimbangan</Text>
            <Text style={styles.emptyHistorySubtext}>Data akan muncul setelah penimbangan pertama</Text>
          </View>
        )}
      </Card>
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
            color={activeTab === 'info' ? '#4A90E2' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Informasi
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'grafik' && styles.activeTab]}
          onPress={() => setActiveTab('grafik')}
        >
          <Ionicons 
            name="bar-chart-outline" 
            size={20} 
            color={activeTab === 'grafik' ? '#4A90E2' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'grafik' && styles.activeTabText]}>
            Riwayat
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'info' ? renderInfoTab() : renderGrafikTab()}

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('BalitaPenimbangan', { balita })}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.floatingButtonText}>Penimbangan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: width > 480 ? 0 : 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width > 480 ? 12 : 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    marginLeft: width > 480 ? 8 : 4,
    fontSize: width > 480 ? 16 : 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  profileCard: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  profileAge: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  infoCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.sm,
  },
  cardTitle: {
    fontSize: width > 480 ? 18 : 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: width > 480 ? 12 : 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    width: 80,
  },
  historyItem: {
    marginVertical: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyAge: {
    fontSize: 14,
    color: '#666',
  },
  historyData: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyDataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  historyDataLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  historyDataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 16,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: width > 480 ? 40 : 20,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: width > 480 ? 20 : 12,
    right: width > 480 ? 20 : 12,
  },
  floatingButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
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