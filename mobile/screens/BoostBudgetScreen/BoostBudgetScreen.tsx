import React from 'react';
import {Text, View} from "react-native";

const BoostBudgetScreen = ({route}) => {

    const {team} = route.params;

    return (
        <View>
            <Text>Boost {team}`s budget</Text>
            <Text>Budget: 500 Mio</Text>
            <Text>+</Text>
            <Text>-</Text>
        </View>
    );
};

export default BoostBudgetScreen;