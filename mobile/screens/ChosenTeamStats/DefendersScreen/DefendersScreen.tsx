import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from 'axios';

const DefendersScreen = ({ route }) => {
    const { careername, team } = route.params;
    const [defenders, setDefenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Liste der gültigen Positionen (Klein- und Großbuchstaben)
    const validPositions = [
        'lv', 'LV',
        'lav', 'LAV',
        'rv', 'RV',
        'rav', 'RAV',
        'iv', 'IV',
        'iv1', 'IV1',
        'iv2', 'IV2',
        'tw', 'TW'
    ];

    useEffect(() => {
        const fetchDefenders = async () => {
            try {
                const response = await axios.get(`http://192.168.1.9:8080/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`);

                // Filtere Spieler nach Team und Position
                const filteredDefenders = response.data.filter(player =>
                    player.clubname === team &&
                    validPositions.includes(player.position)
                );

                setDefenders(filteredDefenders);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching defenders:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDefenders();
    }, [careername, team]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Defenders from {team}</Text>
            <Text style={styles.subtitle}>Career: {careername}</Text>

            {defenders.length > 0 ? (
                <FlatList
                    data={defenders}
                    keyExtractor={(item) => item.playerId.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.playerItem}>
                            <Text style={styles.playerName}>{item.firstname} {item.lastname}</Text>
                            <Text>Position: {item.position}</Text>
                            <Text>Rating: {item.rating}</Text>
                            <Text>Value: {item.value}</Text>
                            <Text>Age: {item.ageNow}</Text>
                            <Text>Potential: {item.potential}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noPlayers}>No defenders found for this team</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#555',
    },
    playerItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    noPlayers: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default DefendersScreen;