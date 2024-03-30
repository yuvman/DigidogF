import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, Vibration } from 'react-native';
import { Audio } from 'expo-av';

export default function GifGridScreen() {
    const [dogMood, setDogMood] = useState('happy');
    const [lastClickedIndex, setLastClickedIndex] = useState(null);
    const [showThanksText, setShowThanksText] = useState(false);
    const [moodChangeMessage, setMoodChangeMessage] = useState('');
    const [countdownTimer, setCountdownTimer] = useState(15);
    const [sound, setSound] = useState(null);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        // Play initial sound when component mounts
        playSound(require('./assets/dog-happy.mp3'));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (countdownTimer > 0) {
                setCountdownTimer(countdownTimer - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdownTimer]);

    useEffect(() => {
        if (countdownTimer === 0) {
            // Deteriorate mood every 15 seconds
            switch (dogMood) {
                case 'happy':
                    setDogMood('bored');
                    setMoodChangeMessage('I am getting bored. Quickly give me a toy!');
                    playSound(require('./assets/dog-bored.mp3'));
                    break;
                case 'bored':
                    setDogMood('sad');
                    setMoodChangeMessage('I am getting sad. Quickly give me a toy!');
                    playSound(require('./assets/dog-sad.mp3'));
                    break;
                case 'sad':
                    setDogMood('angry');
                    setMoodChangeMessage('I am getting angry!! Quickly give me a toy!');
                    playSound(require('./assets/dog-angry.mp3'));
                    break;
                case 'angry':
                    // Dog stays angry until it receives a toy
                    setMoodChangeMessage('I am angry! Give me a toy to make me happy!');
                    break;
                default:
                    break;
            }
            Vibration.vibrate(); // Vibrate when mood changes
            setCountdownTimer(15); // Reset countdown timer
        }
    }, [dogMood, countdownTimer]);

    const playSound = async (soundFile) => {
        try {
            // Stop and unload previous sound if it exists
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
            // Play new sound
            const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.log('Error playing sound: ', error);
        }
    };

    const handleToyClick = (index) => {
        setLastClickedIndex(index);
        setShowThanksText(true);
        setTimeout(() => {
            setShowThanksText(false);
            // Improve mood on getting a toy
            setDogMood('happy');
            setMoodChangeMessage('Keep playing with Milo to keep him happy.');
            setCountdownTimer(15); // Reset countdown timer
            playSound(require('./assets/dog-happy.mp3')); // Play intro sound when toy is given
        }, 2000); // Change back after 2 secs
        // Stop and unload angry sound after toy
        if (dogMood === 'angry') {
            sound.stopAsync();
            sound.unloadAsync();
        }
        // Increase 1 point when a toy is clicked
        setPoints(points + 1);
    };

    const getDogMoodGif = () => {
        switch (dogMood) {
            case 'happy':
                return require('./assets/dog-happy.gif');
            case 'bored':
                return require('./assets/dog-bored.gif');
            case 'sad':
                return require('./assets/dog-sad.gif');
            case 'angry':
                return require('./assets/dog-angry.gif');
            default:
                return require('./assets/dog-happy.gif');
        }
    };

    const toyGifs = [
        { source: require('./assets/ball.gif') },
        { source: require('./assets/dog-food.gif') },
        { source: require('./assets/dog-house.gif') },
        { source: require('./assets/dog-pet.gif') },
        { source: require('./assets/toy.gif') },
        { source: require('./assets/pet-center.gif') }
    ];

    return (
        <View style={styles.mainContainer}>
            <View style={styles.happyTextContainer}>
                {countdownTimer > 0 ? (
                    <Text style={styles.happyText}>Hi! I am Milo! Keep playing with me to keep me entertained.</Text>
                ) : (
                    <Text style={styles.happyText}>Hurry, Milo's mood is changing soon!</Text>
                )}
            </View>
            <Image source={getDogMoodGif()} style={styles.happyDogGif} />
            <View style={styles.happyTextContainer}>
                <Text style={styles.happyText}>{showThanksText ? "Thanks! It improved Milo's Mood!" : moodChangeMessage}</Text>
            </View>
            
           
            <ScrollView contentContainerStyle={styles.gifsContainer}>
                <Text style={styles.title}>Toys - Click on any to play with Milo</Text>
                <View style={styles.row}>
                    {toyGifs.map((toy, index) => (
                        <TouchableOpacity key={index} onPress={() => handleToyClick(index)}>
                            <Image source={toy.source} style={[styles.gif, lastClickedIndex === index && styles.highlighted]} />
                        </TouchableOpacity>

                    ))}
                </View>
            </ScrollView>
            {/* Display points */}
            <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>Points: {points}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
    },
    happyDogGif: {
        paddingTop: 50,
        width: '100%',
        height: '51%',
        resizeMode: 'contain',
    },
    happyTextContainer: {
        backgroundColor: '#7851A9',
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    happyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    gifsContainer: {
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingBottom: 20,
        marginTop: 'auto',
    },
    title: {
        backgroundColor: 'orange',
        color: '#fff',
        padding: 10,
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        
    },
    row: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    gif: {
        width: 100,
        height: 100,
        margin: 2,
    },
    highlighted: {
        
        borderWidth: 2,
        borderColor: 'yellow',
    },
    pointsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    pointsText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
