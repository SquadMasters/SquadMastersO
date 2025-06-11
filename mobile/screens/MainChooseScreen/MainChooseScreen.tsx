import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
} from 'react-native';

const API_BASE_URL = 'http://10.151.6.205:8080';

interface Career {
    careername: string;
    username: string;
    clubname: string;
}

const MainChooseScreen = ({ navigation }: any) => {
    const [users, setUsers] = useState<string[]>([]);
    const [careers, setCareers] = useState<Career[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>("leererError");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/api/auth/allUsernames`);
                const data: string[] = await res.json();
                setUsers(data);
            } catch (e) {
                setError('Fehler beim Laden der Benutzer');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const loadCareers = async (username: string) => {
        try {
            setLoading(true);
            setSelectedUser(username);
            const res = await fetch(`${API_BASE_URL}/trainerCareer/allByUser/${username}`);
            const data: Career[] = await res.json();
            setCareers(data);
        } catch (e) {
            setError('Fehler beim Laden der Karrieren');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#0a84ff" /></View>;
    }

    if (error != null && error !== "null") {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Fehler: {error}</Text>
                <TouchableOpacity style={[styles.button, styles.accent]} onPress={() => setError("null")}>
                    <Text style={[styles.buttonText, styles.accentText]}>Erneut versuchen</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Benutzer auswählen</Text>
                <View style={styles.userList}>
                    {users.map(user => (
                        <TouchableOpacity
                            key={user}
                            onPress={() => loadCareers(user)}
                            style={[
                                styles.cardBase,
                                selectedUser === user && styles.selected
                            ]}
                        >
                            <Text style={styles.userName}>{user}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedUser && (
                    <>
                        <Text style={styles.section}>Karrieren für {selectedUser}</Text>
                        {careers.length > 0 ? (
                            careers.map((career, i) => (
                                <TouchableOpacity
                                    key={`${career.careername}-${i}`}
                                    onPress={() =>
                                        navigation.navigate('OverviewScreen', {
                                            username: career.username,
                                            careername: career.careername,
                                        })
                                    }
                                    style={styles.cardBase}
                                >
                                    <Text style={styles.careerName}>{career.careername}</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.detailLabel}>Verein:</Text>
                                        <Text style={styles.detailValue}>{career.clubname}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.noContent}>
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
    container: { flex: 1, backgroundColor: '#fff' },
    scroll: { padding: 24 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1d1d1f',
        textAlign: 'center',
        marginBottom: 24,
    },
    section: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1d1d1f',
        marginBottom: 16,
    },

    cardBase: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
    },
    selected: {
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        borderColor: '#0a84ff',
    },

    userList: { marginBottom: 24 },
    row: { flexDirection: 'row' },

    userName: { fontSize: 18, fontWeight: '500', color: '#1d1d1f' },
    careerName: { fontSize: 18, fontWeight: '600', color: '#0a84ff', marginBottom: 8 },
    detailLabel: { fontSize: 14, color: '#86868b', marginRight: 8 },
    detailValue: { fontSize: 14, fontWeight: '500', color: '#1d1d1f' },

    noContent: {
        padding: 16,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        alignItems: 'center',
    },
    noContentText: { fontSize: 16, color: '#86868b' },

    error: { fontSize: 16, color: '#ff3b30', textAlign: 'center', marginBottom: 16 },

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
    buttonText: { fontSize: 17, fontWeight: '500', color: '#1d1d1f' },
    accent: {
        backgroundColor: '#0a84ff',
        borderColor: 'rgba(10,132,255,0.24)',
    },
    accentText: { color: '#fff' },
});

export default MainChooseScreen;
