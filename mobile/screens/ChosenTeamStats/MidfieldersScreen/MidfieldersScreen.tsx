import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from 'axios';
import BACKEND_URL from "../../BackendUrl";


interface IPlayer {
    playerId: number;
    firstname: string;
    lastname: string;
    position: string;
    rating: number;
    value: number;
    ageNow: number;
    potential: number;
    clubname: string;
}

const MidfieldersScreen = ({ route, navigation }:any) => {
    const { careername, team } = route.params;
    const [midfielders, setMidfielders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const ip = "192.168.1.7";

    const validPositions = [
        'zm', 'ZM',
        'zdm', 'ZDM',
        'dzm', 'DZM',
        'zom', 'ZOM'
    ];

    useEffect(() => {
        const fetchMidfielders = async () => {
            try {
                const response = await axios.get(`http://${BACKEND_URL}:8080/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`);
                const filteredMidfielders = response.data.filter((player:IPlayer) =>
                    player.clubname === team &&
                    validPositions.includes(player.position)
                );
                setMidfielders(filteredMidfielders);
                setLoading(false);
            } catch (err:any) {
                console.error("Error fetching midfielders:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMidfielders();
    }, [careername, team]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0a84ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Fehler beim Laden der Mittelfeldspieler: {error}</Text>
                <TouchableOpacity
                    style={[styles.button, styles.accentButton, { marginTop: 20 }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.buttonText, styles.accentButtonText]}>Zurück</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Mittelfeldspieler</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Team: <Text style={styles.highlightText}>{team}</Text></Text>
                <Text style={styles.infoText}>Karriere: <Text style={styles.highlightText}>{careername}</Text></Text>
            </View>

            {midfielders.length > 0 ? (
                <FlatList
                    data={midfielders}
                    keyExtractor={(item:IPlayer) => item.playerId.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={styles.playerCard}>
                            <Text style={styles.playerName}>{item.firstname} {item.lastname}</Text>
                            <View style={styles.playerDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Position:</Text>
                                    <Text style={styles.detailValue}>{item.position}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Bewertung:</Text>
                                    <Text style={styles.detailValue}>{item.rating}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Wert:</Text>
                                    <Text style={styles.detailValue}>{item.value}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Alter:</Text>
                                    <Text style={styles.detailValue}>{item.ageNow}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Potenzial:</Text>
                                    <Text style={styles.detailValue}>{item.potential}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <View style={styles.noPlayersContainer}>
                    <Text style={styles.noPlayersText}>Keine Mittelfeldspieler für dieses Team gefunden</Text>
                    <TouchableOpacity
                        style={[styles.button, styles.accentButton, { marginTop: 20 }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[styles.buttonText, styles.accentButtonText]}>Zurück</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // Layout
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 24,
    },
    listContent: {
        paddingBottom: 20,
    },
    infoContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        marginBottom: 24,
    },
    noPlayersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Typografie
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1d1d1f',
        marginBottom: 32,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#86868b',
        marginBottom: 8,
    },
    highlightText: {
        color: '#1d1d1f',
        fontWeight: '500',
    },
    error: {
        color: '#ff3b30',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },

    // Player Cards
    playerCard: {
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'black',
    },
    playerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1d1d1f',
        marginBottom: 12,
    },
    playerDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailLabel: {
        fontSize: 14,
        color: '#86868b',
    },
    detailValue: {
        fontSize: 14,
        color: '#1d1d1f',
        fontWeight: '500',
    },
    noPlayersText: {
        fontSize: 16,
        color: '#86868b',
        textAlign: 'center',
    },

    // Buttons
    button: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#1d1d1f',
    },
    accentButton: {
        backgroundColor: '#0a84ff',
        borderColor: 'rgba(10,132,255,0.24)',
    },
    accentButtonText: {
        color: '#ffffff',
    },
});

export default MidfieldersScreen;