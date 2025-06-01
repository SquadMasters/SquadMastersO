import React from 'react';
import {NavigationProp} from "@react-navigation/native";
import {Text, TouchableOpacity, View} from "react-native";

type ChooseTeamCarrerBoostPlayerProps = {
    navigation: NavigationProp<any>;
};

const ChooseTeamCarrerForBoostPlayerScreen:React.FC<ChooseTeamCarrerBoostPlayerProps> = ({navigation}) => {
    return (
        <View>
            <Text>Choose team to change player stats</Text>
            <Text>real, arsenal, barca</Text>

            <TouchableOpacity onPress={() => navigation.navigate('BoostPlayerScreen')}>
                <Text>Go on</Text>
            </TouchableOpacity>

        </View>
    );
};

export default ChooseTeamCarrerForBoostPlayerScreen;