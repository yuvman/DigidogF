import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
    const [sound, setSound] = useState(null);
    const isFocused = useIsFocused(); // Hook to check focus

    useEffect(() => {
        let soundObject;

        const loadAndPlaySound = async () => {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(
                require('./assets/dog_panting.mp3')
            );
            soundObject = sound;
            setSound(sound);
            await sound.playAsync();
        };

        if (isFocused) {
            loadAndPlaySound();
        }

        return () => {
            // Use soundObject for cleanup
            if (soundObject) {
                console.log('Unloading Sound');
                soundObject.stopAsync().then(() => {
                    soundObject.unloadAsync();
                });
            }
        };
    }, [isFocused]); // Depend on isFocused to re-run effect when navigation focus changes

    return (
        <View style={styles.container}>
            <Image
                source={require('./assets/dog.gif')}
                style={styles.gifStyle}
            />
            <Pressable style={styles.buttonStyle} onPress={() => navigation.navigate('GifGrid')}>
                <Text style={styles.buttonText}>Play</Text>
            </Pressable>
            <StatusBar style="auto" />
        </View>
    );
}

// Styles remain unchanged


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    gifStyle: {
        width: 350,
        height: 350,
        marginBottom: 20,
    },
    buttonStyle: {
        backgroundColor: '#964B00',
        padding: 20,
        paddingLeft: 50,
        paddingRight: 50,
        borderRadius: 20,
        // Add shadow and elevation styles here
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

