import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {NavigationProp} from "@react-navigation/native";

type ChooseTeamCarrerBudgetProps = {
    navigation: NavigationProp<any>;
};


const ChooseTeamCarrerForBoostBudgetScreen:React.FC<ChooseTeamCarrerBudgetProps> = ({navigation}) => {
    return (
        <View>
            <Text>choose team for changing the budget</Text>
            <Text>arsenal, psg , real</Text>

            <TouchableOpacity onPress={() => navigation.navigate('BoostBudgetScreen')}>
                <Text>Go on an boost budget</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChooseTeamCarrerForBoostBudgetScreen;