import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp} from "@react-navigation/native";


type OverviewScreenProps = {
    navigation: NavigationProp<any>;
};



const OverviewScreen:React.FC<OverviewScreenProps> = ({navigation,route}) => {

    const {username,careername} = route.params;

    return (
        <View style={styles.container}>
            <Text>Choose what you want to See For</Text>
            <Text>Username {username}</Text>
            <Text>Carrername {careername}</Text>

            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('BestRatedCarrerPlayersScreen',{
                username,
                careername
            })}>
                <Text>show Best Players from Carrer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('MostTalentedPlayersCarrerScreen',{
                careername,
                username
            })}>
                <Text>most potential players</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('ChooseTeamCarrerForTeamStatScreen',
                {careername,username}
                )}>
                <Text>show stats from team</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('ChooseTeamCarrerForBoostBudgetScreen')}>
                <Text>boost budget</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('ChooseTeamCarrerForBoostPlayerScreen')}>
                <Text>boost player</Text>
            </TouchableOpacity>



        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        alignContent:"center"
    },
    buttons:{
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'black',
        padding:10
    }
})

export default OverviewScreen;