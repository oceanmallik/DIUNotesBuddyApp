import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
    italic: "PlaywriteGBJ-Italic",
    nameTitle: "SpaceGrotesk-regular",
    uName: "BitcountSingle-Regular",
}

export function NameCard({ name, username, webURL, cardURL, otherURL, email, photoURL, contribution }) {
    return (
        <View style={styles.wrapper}>
            <Pressable style={styles.nameCard} onPress={() => Linking.openURL(cardURL)}>
                <Image source={{ uri: photoURL }} style={styles.avatar} />
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.uName}>{username}</Text>
                    <Text style={styles.contribution}>{contribution}</Text>
                </View>
            </Pressable>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => Linking.openURL(webURL)}>
                    <Text style={styles.buttonText}>Website</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => Linking.openURL(otherURL)}>
                    <Text style={styles.buttonText}>Links</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => Linking.openURL(email)}>
                    <Text style={styles.buttonText}>Email</Text>
                </Pressable>
            </View>
        </View>
    );
}

export function TitleCard({ title, description, icon: Icon }) {
    return (
        <View style={styles.titleCard}>
            <Icon size={32} color="rgb(0, 247, 255)" strokeWidth={2} />
            <View style={styles.content}>
                <Text style={styles.nameTwo}>{title}</Text>
                <Text style={styles.subname}>{description}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    nameCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 1,
        borderColor: 'rgb(0, 247, 255)',
        borderRadius: 16,
        padding: 16,
        shadowColor: 'rgba(0, 255, 55, 0.37)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 100,
    },
    titleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 55, 0.61)',
        borderRadius: 8,
        padding: 12,
        shadowColor: 'rgba(0, 255, 55, 0.69)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 100,
        marginHorizontal: 16,
        marginVertical: 8,
        gap: 12,
    },
    content: {
        flexDirection: 'column',
        flex: 1,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        marginRight: 14,
        alignSelf: 'center',
        borderWidth: 3,
        borderColor: 'green',
    },
    name: {
        fontFamily: fonts.nameTitle,
        fontSize: 20,
        color: 'white',
    },
    nameTwo: {
        fontFamily: fonts.nameTitle,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    subname: {
        fontFamily: fonts.regular,
        fontSize: 11,
        textAlign: 'center',
        marginVertical: 2,
        color: 'grey',
    },
    contribution: {
        fontFamily: fonts.regular,
        fontSize: 12,
        textAlign: 'left',
        marginVertical: 2,
        color: 'grey',
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
        fontSize: 15,
        textAlign: 'left',
        color: 'red',
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