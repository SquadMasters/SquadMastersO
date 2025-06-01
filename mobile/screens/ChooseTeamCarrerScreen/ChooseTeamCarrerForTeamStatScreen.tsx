import React, { useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet, Dimensions } from "react-native";
import { NavigationProp } from "@react-navigation/native";

type ChooseTeamCarrerStatsProps = {
    navigation: NavigationProp<any>;
};

const { width } = Dimensions.get('window');

const teamLogos = [
    { id: 1, name: 'Arsenal', logo: require('../../assets/arsenalwappen.png') },
    { id: 2, name: 'Atlético Madrid', logo: require('../../assets/atleticowappen.png') },
    { id: 3, name: 'FC Barcelona', logo: require('../../assets/barcawappen.png') },
    { id: 4, name: 'Bayern München', logo: require('../../assets/bayernwappen.png') },
    { id: 5, name: 'Manchester City', logo: require('../../assets/citywappen.png') },
    { id: 6, name: 'Inter Mailand', logo: require('../../assets/interwappen.png') },
    { id: 7, name: 'Juventus Turin', logo: require('../../assets/juve.png') },
    { id: 8, name: 'Liverpool', logo: require('../../assets/liverpool.png') },
    { id: 9, name: 'AC Mailand', logo: require('../../assets/milan.png') },
    { id: 10, name: 'Paris Saint-Germain', logo: require('../../assets/psgwappen.png') },
    { id: 11, name: 'Real Madrid', logo: require('../../assets/reallogo.png') }
];

const ChooseTeamCarrerForTeamStatScreen: React.FC<ChooseTeamCarrerStatsProps> = ({ navigation,route }) => {

    const {careername} = route.params;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / (width - 40));
        if (index >= 0 && index < teamLogos.length && index !== selectedIndex) {
            setSelectedIndex(index);
        }
    };

    const getItemLayout = (data: any, index: number) => ({
        length: width - 40,
        offset: (width - 40) * index,
        index
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose team to see the team stats from carrer: {careername}</Text>

            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={teamLogos}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <Image
                                source={item.logo}
                                style={styles.teamLogo}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    style={styles.carousel}
                    getItemLayout={getItemLayout}
                />
            </View>

            <Text style={styles.teamName}>{teamLogos[selectedIndex]?.name || ''}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ChooseTeamStatsScreen', {
                    team: teamLogos[selectedIndex].name,
                    careername
                })}
            >
                <Text style={styles.buttonText}>View {teamLogos[selectedIndex].name} stats</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    carouselContainer: {
        height: 200,
        width: '100%',
        marginBottom: 20,
    },
    carousel: {
        flexGrow: 0,
    },
    slide: {
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamLogo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    teamName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ChooseTeamCarrerForTeamStatScreen;