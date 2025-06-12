import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import BACKEND_URL from "../BackendUrl";

interface Player {
    playerId: number;
    firstname: string;
    lastname: string;
    position: string;
    rating: number;
    clubname: string;
    potential: number;
    value: number;
}

const BestRatedCarrerPlayersScreen = ({route}: any) => {
    const {careername} = route.params;
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(
                    `http://${BACKEND_URL}:8080/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`
                );
                const data: Player[] = await response.json();

                const sortedPlayers = data
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 15);
                setPlayers(sortedPlayers);
            } catch (error) {
                console.error('Error fetching players:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers()
    }, [careername]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0a84ff"/>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Top 15 Spieler – {careername}</Text>

            {players.map((player, index) => (
                <View key={player.playerId} style={styles.playerCard}>
                    <View style={styles.playerHeader}>
                        <Text style={styles.rank}>{index + 1}.</Text>
                        <Text style={styles.playerName}>
                            {player.firstname} {player.lastname}
                        </Text>
                        <Text style={styles.rating}>{player.rating}</Text>
                    </View>

                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Position</Text>
                            <Text style={styles.detailValue}>{player.position}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Potential</Text>
                            <Text style={styles.detailValue}>{player.potential}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Verein</Text>
                            <Text style={styles.detailValue}>{player.clubname}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Wert</Text>
                            <Text style={styles.detailValue}>€{player.value.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Layout
    container: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

    // Header
    header: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1d1d1f',
        marginBottom: 24,
        paddingHorizontal: 8,
    },

    // Player Cards
    playerCard: {
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    playerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rank: {
        fontSize: 16,
        color: '#86868b',
        marginRight: 8,
        width: 24,
    },
    playerName: {
        fontSize: 17,
        fontWeight: '500',
        color: '#1d1d1f',
        flex: 1,
    },
    rating: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0a84ff',
    },

    // Details Grid
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailItem: {
        width: '48%',
    },
    detailLabel: {
        fontSize: 13,
        color: '#86868b',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1d1d1f',
    },
});

export default BestRatedCarrerPlayersScreen;