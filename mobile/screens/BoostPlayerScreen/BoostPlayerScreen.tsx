import React from 'react';
import {Text, View} from "react-native";

const BoostPlayerScreen = ({route}) => {

    const {team} = route.params;

    return (
        <View>
            <Text>Boost player stats from team: {team}</Text>
        </View>
    );
};

export default BoostPlayerScreen;