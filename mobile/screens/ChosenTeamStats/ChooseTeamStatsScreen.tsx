import React from 'react';
import {NavigationProp} from "@react-navigation/native";
import {Text, TouchableOpacity, View} from "react-native";

type ChooseTeamStatsProps = {
    navigation: NavigationProp<any>;
};

const ChooseTeamStatsScreen:React.FC<ChooseTeamStatsProps> = ({navigation}) => {
    return (
        <View>
            <Text>Choose what you want to see</Text>

            <TouchableOpacity onPress={() => navigation.navigate('ForwardsScreen')}>
                <Text>See Forwards</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MidfielderScreen')}>
                <Text>See Midfielders</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('DefendersScreen')}>
                <Text>See Defenders</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AllPlayersScreen')}>
                <Text>See All</Text>
            </TouchableOpacity>

        </View>
    );
};

export default ChooseTeamStatsScreen;