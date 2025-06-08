import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp} from "@react-navigation/native";

type OverviewScreenProps = {
    navigation: NavigationProp<any>;
};

const OverviewScreen: React.FC<OverviewScreenProps> = ({navigation, route}) => {
    const {username, careername} = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Karriere-Übersicht</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Benutzer: <Text style={styles.highlightText}>{username}</Text></Text>
                <Text style={styles.infoText}>Karriere: <Text style={styles.highlightText}>{careername}</Text></Text>
            </View>

            <View style={styles.buttonGrid}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('BestRatedCarrerPlayersScreen', {username, careername})}
                >
                    <Text style={styles.buttonText}>Topspieler anzeigen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('MostTalentedPlayersCarrerScreen', {careername, username})}
                >
                    <Text style={styles.buttonText}>Talente entdecken</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('ChooseTeamCarrerForTeamStatScreen', {careername, username})}
                >
                    <Text style={styles.buttonText}>Teamstatistiken</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.accentButton]}
                    onPress={() => navigation.navigate('ChooseTeamCarrerForBoostBudgetScreen', {careername, username})}
                >
                    <Text style={[styles.buttonText, styles.accentButtonText]}>Budget boosten</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.accentButton]}
                    onPress={() => navigation.navigate('ChooseTeamCarrerForBoostPlayerScreen' ,{careername, username})}
                >
                    <Text style={[styles.buttonText, styles.accentButtonText]}>Spieler boosten</Text>
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

export default OverviewScreen;