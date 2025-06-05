import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

const API_BASE_URL = 'http://10.151.6.121:8080';


const MainChooseScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [careers, setCareers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0a84ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Fehler: {error}</Text>
                <TouchableOpacity
                    style={[styles.button, styles.accentButton, { marginTop: 20 }]}
                    onPress={() => setError(null)}
                >
                    <Text style={[styles.buttonText, styles.accentButtonText]}>Erneut versuchen</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.headerTitle}>Benutzer auswählen</Text>

                <View style={styles.userList}>
                    {users.map(user => (
                        <TouchableOpacity
                            key={user}
                            onPress={() => loadCareers(user)}
                            style={[
                                styles.userCard,
                                selectedUser === user && styles.userCardSelected
                            ]}
                        >
                            <Text style={styles.userName}>{user}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedUser && (
                    <>
                        <Text style={styles.sectionTitle}>Karrieren für {selectedUser}</Text>

                        {careers.length > 0 ? (
                            <View style={styles.careerList}>
                                {careers.map((career, index) => (
                                    <TouchableOpacity
                                        key={`${career.careerName}-${index}`}
                                        onPress={() => navigation.navigate('OverviewScreen', {
                                            username: career.username,
                                            careername: career.careerName,
                                        })}
                                        style={styles.careerCard}
                                    >
                                        <Text style={styles.careerName}>{career.careerName}</Text>
                                        <View style={styles.careerDetailRow}>
                                            <Text style={styles.careerDetailLabel}>Verein:</Text>
                                            <Text style={styles.careerDetailValue}>{career.clubName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.noContentContainer}>
                                <Text style={styles.noContentText}>Keine Karrieren verfügbar</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    // Layout
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        padding: 24,
    },
    userList: {
        marginBottom: 24,
    },
    careerList: {
        marginBottom: 24,
    },
    noContentContainer: {
        padding: 16,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        alignItems: 'center',
    },

    // Typografie
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1d1d1f',
        marginBottom: 24,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1d1d1f',
        marginBottom: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1d1d1f',
    },
    careerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0a84ff',
        marginBottom: 8,
    },
    careerDetailRow: {
        flexDirection: 'row',
    },
    careerDetailLabel: {
        fontSize: 14,
        color: '#86868b',
        marginRight: 8,
    },
    careerDetailValue: {
        fontSize: 14,
        color: '#1d1d1f',
        fontWeight: '500',
    },
    noContentText: {
        fontSize: 16,
        color: '#86868b',
    },
    error: {
        color: '#ff3b30',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },

    // Cards
    userCard: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
    },
    userCardSelected: {
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        borderColor: '#0a84ff',
    },
    careerCard: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
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

export default MainChooseScreen;