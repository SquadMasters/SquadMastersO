import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

const API_BASE_URL = 'http://192.168.1.8:8080';

const MainChooseScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [careers, setCareers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Benutzer laden
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/auth/allUsernames`);
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError('Fehler beim Laden der Benutzer');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    // Karrieren laden
    const loadCareers = async (username) => {
        try {
            setLoading(true);
            setSelectedUser(username);
            const response = await fetch(`${API_BASE_URL}/trainerCareer/allByUser/${username}`);
            const data = await response.json();
            setCareers(data);
        } catch (err) {
            setError('Fehler beim Laden der Karrieren');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Benutzer auswählen</Text>

            {users.map(user => (
                <TouchableOpacity
                    key={user}
                    onPress={() => loadCareers(user)}
                    style={{
                        padding: 15,
                        marginBottom: 10,
                        backgroundColor: selectedUser === user ? '#e0e0e0' : '#f5f5f5',
                        borderRadius: 5
                    }}
                >
                    <Text>{user}</Text>
                </TouchableOpacity>
            ))}

            {selectedUser && (
                <>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 25, marginBottom: 15 }}>
                        Karriere auswählen für {selectedUser}
                    </Text>

                    {careers.length > 0 ? (
                        careers.map((career, index) => (
                            <TouchableOpacity
                                key={`${career.careerName}-${index}`}
                                onPress={() => navigation.navigate('OverviewScreen', {
                                    username: career.username,
                                    careername: career.careerName,
                                })}
                                style={{
                                    padding: 15,
                                    marginBottom: 10,
                                    backgroundColor: '#e8f4f8',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#d0d0d0'
                                }}
                            >
                                <Text style={{ fontWeight: 'bold' }}>{career.careerName}</Text>
                                <Text>Club: {career.clubName}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ fontStyle: 'italic' }}>Keine Karrieren verfügbar</Text>
                    )}
                </>
            )}
        </ScrollView>
    );
};

export default MainChooseScreen;