import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

interface Player {
    playerId: number;
    firstname: string;
    lastname: string;
    position: string;
    rating: number;
    clubname: string;
    potential: number;
    value: number;
    potentialDifference?: number;
}

const MostTalentPlayersCarrerScreen = ({ route }) => {
    const { careername, username } = route.params;
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(
                    `http://10.151.6.92:8080/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`
                );
                const data = await response.json();

                const sortedPlayers = data
                    .map(player => ({
                        ...player,
                        potentialDifference: (player.potential || 0) - (player.rating || 0)
                    }))
                    .sort((a, b) => b.potentialDifference - a.potentialDifference)
                    .slice(0, 15);
                setPlayers(sortedPlayers);
            } catch (error) {
                console.error('Error fetching players:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [careername]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0a84ff" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>
                Top 15 Talente – {careername}
                <Text style={styles.subHeader}> • {username}</Text>
            </Text>

            {players.map((player, index) => (
                <View key={player.playerId} style={styles.playerCard}>
                    <View style={styles.playerHeader}>
                        <Text style={styles.rank}>{index + 1}.</Text>
                        <View style={styles.nameContainer}>
                            <Text style={styles.playerName}>
                                {player.firstname} {player.lastname}
                            </Text>
                            <Text style={styles.position}>{player.position}</Text>
                        </View>
                        <View style={styles.potentialBadge}>
                            <Text style={styles.potentialText}>+{player.potentialDifference}</Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Aktuell</Text>
                            <Text style={styles.statValue}>{player.rating}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Potential</Text>
                            <Text style={[styles.statValue, styles.highlightStat]}>{player.potential}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Verein</Text>
                            <Text style={styles.statValue}>{player.clubname}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Wert</Text>
                            <Text style={styles.statValue}>€{player.value.toLocaleString()}</Text>
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
    },
    subHeader: {
        fontSize: 16,
        color: '#86868b',
        fontWeight: '400',
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
    nameContainer: {
        flex: 1,
    },
    playerName: {
        fontSize: 17,
        fontWeight: '500',
        color: '#1d1d1f',
    },
    position: {
        fontSize: 14,
        color: '#86868b',
    },
    potentialBadge: {
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    potentialText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0a84ff',
    },

    // Stats Grid
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statItem: {
        width: '48%',
    },
    statLabel: {
        fontSize: 13,
        color: '#86868b',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1d1d1f',
    },
    highlightStat: {
        color: '#0a84ff',
    },
});

export default MostTalentPlayersCarrerScreen;