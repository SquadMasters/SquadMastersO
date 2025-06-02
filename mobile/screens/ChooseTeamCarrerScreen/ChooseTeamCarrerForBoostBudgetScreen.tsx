import React, { useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet, Dimensions } from "react-native";
import { NavigationProp } from "@react-navigation/native";

type ChooseTeamCarrerBudgetProps = {
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

const ChooseTeamCarrerForBoostBudgetScreen: React.FC<ChooseTeamCarrerBudgetProps> = ({ navigation ,route}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const {careername, username} = route.params;

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / (width - 40)); // Angepasst auf die Slide-Breite
        if (index >= 0 && index < teamLogos.length && index !== selectedIndex) {
            setSelectedIndex(index);
        }
    };

    const getItemLayout = (data: any, index: number) => ({
        length: width - 40, // Slide-Breite
        offset: (width - 40) * index,
        index
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose team for changing the budget</Text>

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
                onPress={() => navigation.navigate('BoostBudgetScreen', {
                    team: teamLogos[selectedIndex].name,
                    careername

                })}
            >
                <Text style={styles.buttonText}>Select {teamLogos[selectedIndex].name} and boost budget</Text>
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
        backgroundColor: '#f5f5f7',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 30,
        color: '#1c1c1e',
        textAlign: 'center',
    },
    carouselContainer: {
        height: 220,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 18,  // Mehr Rundung
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
        paddingVertical: 10,
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
        width: 160,
        height: 160,
        resizeMode: 'contain',
    },
    teamName: {
        fontSize: 22,
        fontWeight: '600',
        marginVertical: 15,
        color: '#1c1c1e',
    },
    // NEUE BUTTON STYLES (Apple Modern)
    button: {
        backgroundColor: '#0071e3',  // Intensiveres Apple Blau
        padding: 18,
        borderRadius: 14,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#0071e3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonPressed: {  // Für Press-Effekt
        backgroundColor: '#0062c4',
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 17,
        letterSpacing: -0.2,  // Apple-typische Buchstabenabstände
    },
    // NEU: Pulsierender Effekt für ausgewähltes Team
    selectedTeamIndicator: {
        position: 'absolute',
        top: -10,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
    },

});
export default ChooseTeamCarrerForBoostBudgetScreen;