import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import BACKEND_URL from "../BackendUrl";

interface Player {
    playerId: number;
    firstname: string;
    lastname: string;
    clubname: string;
}


const BoostPlayerScreen = ({ route }:any) => {
    const { team, careername } = route.params;
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [ratingNow, setRatingNow] = useState('');
    const [valueNow, setValueNow] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get<Player[]>(`http://${BACKEND_URL}:8080/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`)
            .then(res => {
                const teamPlayers = res.data.filter(p => p.clubname === team);
                setPlayers(teamPlayers);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fehler beim Laden:", err);
                setLoading(false);
            });
    }, [careername, team]);

    const handleUpdate = async () => {
        if (!selectedPlayer) return;
        const payload: { ratingNow?: number; valueNow?: number } = {};

        if (ratingNow.trim() !== '') payload.ratingNow = parseInt(ratingNow);
        if (valueNow.trim() !== '') payload.valueNow = parseFloat(valueNow);

        if (Object.keys(payload).length === 0) return;

        await axios.patch(`http://${BACKEND_URL}:8080/trainerCareerPlayer/updateAttributes`, payload, {
            params: {
                careername,
                playerId: selectedPlayer.playerId,
            },
        });
        alert("Spieler aktualisiert!");
    };

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#0a84ff" />;
    }

    return (
        <View style={[styles.container, selectedPlayer && styles.dimmedBackground]}>
            <Text style={styles.header}>Boost Player Stats</Text>
            <FlatList
                data={players}
                keyExtractor={item => item.playerId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.playerCard, selectedPlayer?.playerId === item.playerId && styles.selected]}
                        onPress={() => {
                            if (selectedPlayer?.playerId === item.playerId) {
                                setSelectedPlayer(null);
                                setRatingNow('');
                                setValueNow('');
                            } else {
                                setSelectedPlayer(item);
                            }
                        }}>
                        <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
                    </TouchableOpacity>
                )}
            />
            {selectedPlayer && (
                <View style={styles.overlay}>
                    <View style={styles.blurBackground} />

                    <View style={styles.formContainer}>

                        <View style={styles.form}>
                            <Text style={styles.formLabel  }>{selectedPlayer.firstname + " "+ selectedPlayer.lastname}</Text>
                            <Text style={styles.formLabel}>Neues Rating:</Text>
                            <TextInput
                                style={styles.input}
                                value={ratingNow}
                                onChangeText={setRatingNow}
                                placeholder="1-10"
                                keyboardType="number-pad"
                            />
                            <Text style={styles.formLabel}>Neuer Marktwert:</Text>
                            <TextInput
                                style={styles.input}
                                value={valueNow}
                                onChangeText={setValueNow}
                                placeholder="100000000 (100 Mio)"
                                keyboardType="decimal-pad"
                            />
                            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                                <Text style={styles.updateButtonText}>Aktualisieren</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setSelectedPlayer(null);
                                setRatingNow('');
                                setValueNow('');
                            }} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Schließen</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    dimmedBackground: {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#000',
    },
    playerCard: {
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    selected: {
        backgroundColor: '#cce5ff',
    },
    name: {
        fontSize: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    blurBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    formContainer: {
        width: '85%',
        zIndex: 11,
        marginTop: -height * 0.15,
    },
    form: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        elevation: 5,
    },
    formLabel: {
        fontSize: 14,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
        backgroundColor: 'white',
    },
    updateButton: {
        backgroundColor: '#0a84ff',
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    updateButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    closeButton: {
        backgroundColor: '#d0d0d0',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#333',
        fontWeight: '500',
    },
});

export default BoostPlayerScreen;
