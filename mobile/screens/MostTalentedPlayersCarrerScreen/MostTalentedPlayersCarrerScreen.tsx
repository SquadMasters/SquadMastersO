import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

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

const MostTalentPlayersCarrerScreen = ({ route }) => {
    const { careername,username } = route.params;
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(
                    `http://192.168.1.8:8080/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`
                );
                const data = await response.json();

                // Sort by potential-rating difference (descending) and take top 15
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
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Top 15 Most Talented Players for {careername} played bei user: {username}
            </Text>
            {players.map((player, index) => (
                <View
                    key={player.playerId}
                    style={{
                        marginBottom: 12,
                        padding: 12,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 8
                    }}
                >
                    <Text style={{ fontWeight: 'bold' }}>
                        {index + 1}. {player.firstname} {player.lastname}
                    </Text>
                    <Text>Current Rating: {player.rating}</Text>
                    <Text>Potential: {player.potential}</Text>
                    <Text>Potential Difference: {player.potential - player.rating}</Text>
                    <Text>Position: {player.position}</Text>
                    <Text>Club: {player.clubname}</Text>
                    <Text>Value: {player.value}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default MostTalentPlayersCarrerScreen;