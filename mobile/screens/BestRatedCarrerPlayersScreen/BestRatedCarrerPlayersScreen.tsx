import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView} from 'react-native';

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

const BestRatedCarrerPlayersScreen = ({ route }) => {
    const { careername } = route.params;
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(
                    `http://192.168.1.8:8080/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`
                );
                const data = await response.json();

                // Sort by rating descending and take top 15
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

        fetchPlayers();
    }, [careername]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            <Text>Top 15 Players for {careername}</Text>
            {players.map((player, index) => (
                <View key={player.playerId}>
                    <Text>
                        {index + 1}. {player.firstname} {player.lastname}
                        {"\n"}
                        {"\t"} Rating: {player.rating}
                        {"\n"}
                        {"\t"} Potential: {player.potential}
                        {"\n"}
                        {"\t"} Position: {player.position}
                        {"\n"}
                        {"\t"} Club: {player.clubname}
                        {"\n"}
                        {"\t"} Value: {player.value}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default BestRatedCarrerPlayersScreen;