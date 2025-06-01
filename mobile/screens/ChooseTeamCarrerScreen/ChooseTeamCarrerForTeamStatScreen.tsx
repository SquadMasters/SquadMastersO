import React from 'react';
import {NavigationProp} from "@react-navigation/native";
import {Text, TouchableOpacity, View} from "react-native";

type ChooseTeamCarrerStatsProps = {
    navigation: NavigationProp<any>;
};

const ChooseTeamCarrerForTeamStatScreen:React.FC<ChooseTeamCarrerStatsProps> = ({navigation}) => {
    return (
        <View>
            <Text>Choose team to see the teams stats</Text>
            <Text>arsneal , real, barca test</Text>

            <TouchableOpacity onPress={() => navigation.navigate('ChooseTeamStatsScreen')}>
                <Text>Go on to choose team stats screen</Text>
            </TouchableOpacity>

        </View>
    );
};

export default ChooseTeamCarrerForTeamStatScreen;