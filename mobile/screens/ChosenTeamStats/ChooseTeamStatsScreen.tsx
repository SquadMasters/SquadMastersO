import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp} from "@react-navigation/native";

type ChooseTeamStatsProps = {
    navigation: NavigationProp<any>;
};

const ChooseTeamStatsScreen: React.FC<ChooseTeamStatsProps> = ({navigation, route}:any) => {
    const {team, careername} = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Teamstatistiken</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Team: <Text style={styles.highlightText}>{team}</Text></Text>
                <Text style={styles.infoText}>Karriere: <Text style={styles.highlightText}>{careername}</Text></Text>
            </View>

            <View style={styles.buttonGrid}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('ForwardsScreen', {careername, team})}
                >
                    <Text style={styles.buttonText}>Stürmer anzeigen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('MidfielderScreen', {careername, team})}
                >
                    <Text style={styles.buttonText}>Mittelfeldspieler anzeigen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('DefendersScreen', {careername, team})}
                >
                    <Text style={styles.buttonText}>Verteidiger anzeigen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => navigation.navigate('AllPlayersScreen', {team, careername})}
                >
                    <Text style={[styles.buttonText]}>Alle Spieler anzeigen</Text>
                </TouchableOpacity>
            </View>
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
    buttonGrid: {
        width: '100%',
        marginTop: 32,
        gap: 16,
    },
    infoContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        marginBottom: 24,
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

export default ChooseTeamStatsScreen;