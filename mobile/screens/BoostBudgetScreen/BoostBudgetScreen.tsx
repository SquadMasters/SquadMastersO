import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TextInput, TouchableOpacity, View, StyleSheet} from "react-native";
import axios from "axios";
import BACKEND_URL from "../BackendUrl";

const BoostBudgetScreen = ({route}:any) => {
    const {team, careername} = route.params;
    const [budget, setBudget] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBudget, setNewBudget] = useState('');


    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const response = await axios.get(
                    `http://${BACKEND_URL}:8080/trainerCareer/budget/${team}/${careername}`
                );
                setBudget(response.data.budget || 0);
                setLoading(false);
            } catch (err:any) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchBudget();
    }, [careername, team]);

    const updateBudget = async () => {

        console.log("update");

        try {
            const value = Number(newBudget).toString()+"000000";
            console.log(value)
            await axios.patch(
                `http://${BACKEND_URL}:8080/trainerCareer/changebudget/${team}/${careername}/${value}`
            );

            setBudget(Number(value));
            setNewBudget('');
        } catch (err) {
            console.error("Error updating budget:", err);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0a84ff" />;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{team}'s Budget</Text>
            <Text style={styles.budget}>
                {budget >= 1e6 ? `${(budget/1e6)|0} Mio` : `${(budget/1e3)|0}k`} €
            </Text>

            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={newBudget}
                onChangeText={setNewBudget}
                placeholder="Neues Budget eingeben"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={updateBudget}
            >
                <Text style={styles.buttonText}>Budget aktualisieren</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    budget: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2ecc71'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        width: '80%',
        borderRadius: 5,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default BoostBudgetScreen;