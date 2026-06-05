import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
    italic: "PlaywriteGBJ-Italic",
    nameTitle: "Aubrey-Regular",
    uName: "BitcountSingle-Regular",
}

export function NameCard({ name, description, username, githubURL, otherURL, photoURL }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>
                <Image source={{ uri: photoURL }} style={styles.avatar} />
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.uName}>{username}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => Linking.openURL(githubURL)}>
                    <Text style={styles.buttonText}>View GitHub</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => Linking.openURL(otherURL)}>
                    <Text style={styles.buttonText}>Other Links</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 1,
        borderColor: 'rgba(0, 213, 255, 0.73)',
        borderRadius: 16,
        padding: 16,
        shadowColor: 'rgba(0, 212, 255, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 50,
    },
    content: {
        flexDirection: 'column',
        flex: 1,
    },
    avatar: {
        width: 86,
        height: 86,
        borderRadius: 44,
        marginRight: 14,
    },
    name: {
        fontFamily: fonts.nameTitle,
        fontSize: 26,
        color: 'white',
    },
    description: {
        fontFamily: fonts.italic,
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 2,
        color: 'grey',
    },
    uName: {
        fontFamily: fonts.uName,
        fontSize: 13,
        textAlign: 'left',
        color: 'grey',
    },
    button: {
        marginTop: 10,
        marginHorizontal: 8,
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
        borderWidth: 1.5,
        borderColor: 'rgba(0,212,255,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0, 212, 255, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 100,
    },
    buttonText: {
        fontFamily: fonts.regular,
        color: '#00d4ff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
})