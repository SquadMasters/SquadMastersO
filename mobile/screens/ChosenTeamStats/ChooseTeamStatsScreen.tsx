import React from 'react';
import {NavigationProp} from "@react-navigation/native";
import {Text, TouchableOpacity, View} from "react-native";

type ChooseTeamStatsProps = {
    navigation: NavigationProp<any>;
};

const ChooseTeamStatsScreen:React.FC<ChooseTeamStatsProps> = ({navigation,route}) => {

    const {team,careername} = route.params;

    return (
        <View>
            <Text>Choose what you want to see from chosen team: {team}</Text>

            <TouchableOpacity onPress={() => navigation.navigate('ForwardsScreen',{careername,team})}>
                <Text>See Forwards</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MidfielderScreen',{careername,team})}>
                <Text>See Midfielders</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('DefendersScreen',{careername,team})}>
                <Text>See Defenders</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AllPlayersScreen',{team,careername})}>
                <Text>See All</Text>
            </TouchableOpacity>

        </View>
    );
};

export default ChooseTeamStatsScreen;