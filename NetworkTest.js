import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Simple network test component
// Usage: import NetworkTest from './NetworkTest' and render it in your app

export default function NetworkTest() {
  const [status, setStatus] = useState({isConnected: null, type: null});

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setStatus({isConnected: state.isConnected, type: state.type});
    });

    // Get current state once on mount
    NetInfo.fetch().then(state => {
      setStatus({isConnected: state.isConnected, type: state.type});
    });

    return () => unsubscribe();
  }, []);

  const recheck = () => {
    NetInfo.fetch().then(state => {
      setStatus({isConnected: state.isConnected, type: state.type});
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Test</Text>
      <Text style={styles.line}>Connected: {status.isConnected === null ? 'unknown' : status.isConnected ? 'yes' : 'no'}</Text>
      <Text style={styles.line}>Type: {status.type ?? 'unknown'}</Text>
      <View style={styles.button}>
        <Button title="Re-check" onPress={recheck} />
      </View>
      <Text style={styles.note}>Check console/logcat for more details from the NetInfo event listener.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 12},
  line: {fontSize: 16, marginVertical: 4},
  button: {marginTop: 12, width: '60%'},
  note: {marginTop: 12, fontSize: 12, color: '#666', textAlign: 'center'},
});