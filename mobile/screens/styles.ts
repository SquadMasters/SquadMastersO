import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    fullWidthButton: {
        backgroundColor: 'green',
        padding: 20,
        width: '100%',
        alignItems: 'center',
    },
    fullWidthButton2: {
        backgroundColor: 'lightgreen',
        padding: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    topButtonContainer: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    topLeftButton: {
        backgroundColor: 'green',
        width: 50,
        height: 50,
    },
    topRightButton: {
        backgroundColor: 'red',
        width: 50,
        height: 50,
    },
    submitButtonContainer: {
        position: 'absolute',
        bottom: 50,
    },
    submitButton: {
        backgroundColor: 'gray',
        padding: 15,
        borderRadius: 10,
    }
});