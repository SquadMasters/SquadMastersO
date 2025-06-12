import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import MainChooseScreen from "./screens/MainChooseScreen/MainChooseScreen";
import OverviewScreen from "./screens/OverviewScreen/OverviewScreen";
import BestRatedCarrerPlayersScreen from "./screens/BestRatedCarrerPlayersScreen/BestRatedCarrerPlayersScreen";
import MostTalentedPlayersCarrerScreen from "./screens/MostTalentedPlayersCarrerScreen/MostTalentedPlayersCarrerScreen";
import ChooseTeamStatsScreen from "./screens/ChosenTeamStats/ChooseTeamStatsScreen";
import AllPlayersScreen from "./screens/ChosenTeamStats/AllPlayersScreen/AllPlayersScreen";
import DefendersScreen from "./screens/ChosenTeamStats/DefendersScreen/DefendersScreen";
import ForwardsScreen from "./screens/ChosenTeamStats/ForwardsScreen/ForwardsScreen";
import MidfieldersScreen from "./screens/ChosenTeamStats/MidfieldersScreen/MidfieldersScreen";
import BoostPlayerScreen from "./screens/BoostPlayerScreen/BoostPlayerScreen";
import BoostBudgetScreen from "./screens/BoostBudgetScreen/BoostBudgetScreen";
import ChooseTeamCarrerForTeamStatScreen from "./screens/ChooseTeamCarrerScreen/ChooseTeamCarrerForTeamStatScreen";
import ChooseTeamCarrerForBoostPlayerScreen from "./screens/ChooseTeamCarrerScreen/ChooseTeamCarrerForBoostPlayerScreen";
import ChooseTeamCarrerForBoostBudgetScreen from "./screens/ChooseTeamCarrerScreen/ChooseTeamCarrerForBoostBudgetScreen";


const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MainChooseScreen" screenOptions={{headerShown: true}}>
                <Stack.Screen name="MainChooseScreen" component={MainChooseScreen}/>
                <Stack.Screen name="OverviewScreen" component={OverviewScreen}/>
                <Stack.Screen name="BestRatedCarrerPlayersScreen" component={BestRatedCarrerPlayersScreen}/>
                <Stack.Screen name="MostTalentedPlayersCarrerScreen" component={MostTalentedPlayersCarrerScreen}/>
                <Stack.Screen name="ChooseTeamStatsScreen" component={ChooseTeamStatsScreen}/>
                <Stack.Screen name="AllPlayersScreen" component={AllPlayersScreen}/>
                <Stack.Screen name="DefendersScreen" component={DefendersScreen}/>
                <Stack.Screen name="ForwardsScreen" component={ForwardsScreen}/>
                <Stack.Screen name="MidfielderScreen" component={MidfieldersScreen}/>
                <Stack.Screen name="BoostPlayerScreen" component={BoostPlayerScreen}/>
                <Stack.Screen name="BoostBudgetScreen" component={BoostBudgetScreen}/>
                <Stack.Screen name="ChooseTeamCarrerForTeamStatScreen" component={ChooseTeamCarrerForTeamStatScreen}/>
                <Stack.Screen name="ChooseTeamCarrerForBoostPlayerScreen" component={ChooseTeamCarrerForBoostPlayerScreen}/>
                <Stack.Screen name="ChooseTeamCarrerForBoostBudgetScreen" component={ChooseTeamCarrerForBoostBudgetScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}


