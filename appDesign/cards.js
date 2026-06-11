import { router } from 'expo-router';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export const fonts = {
    regular: "SpaceGrotesk-Regular",
    bold: "SpaceGrotesk-Bold",
    italic: "PlaywriteGBJ-Italic",
    uName: "BitcountSingle-Regular",
}

export function NameCard({ name, username, webURL, cardURL, otherURL, email, photoURL, contribution, button1, button2, button3, ID }) {
    return (
        <View style={styles.wrapper}>
            <Pressable style={styles.nameCard} onPress={() => Linking.openURL(cardURL)}>
                <Image source={{ uri: photoURL }} style={styles.avatar} />
                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.uName}>{username}</Text>
                    <Text style={styles.contribution}>{contribution}</Text>
                    <Text style={styles.contribution}>Student ID: {ID}</Text>
                </View>
            </Pressable>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => Linking.openURL(webURL)}>
                    <Text style={styles.buttonText}>{button1}</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => Linking.openURL(otherURL)}>
                    <Text style={styles.buttonText}>{button2}</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => Linking.openURL(email)}>
                    <Text style={styles.buttonText}>{button3}</Text>
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

export function TitleCardScroll({ title, description, icon: Icon }) {
    return (
        <View style={styles.titleCardScroll}>
            <Icon size={32} color="rgb(0, 247, 255)" strokeWidth={2} />
            <View style={styles.content}>
                <Text style={styles.nameTwo}>{title}</Text>
                <Text style={styles.subname}>{description}</Text>
            </View>
        </View>
    )
}

export function TitleCardLinked({ title, link, icon: Icon }) {
    return (
        <Pressable
            style={styles.titleCardLinked}
            android_ripple={{ color: 'transparent' }}
            onPress={() => router.push(link)}
        >
            <Icon size={26} color="rgb(255, 0, 0)" strokeWidth={1} />
            <View style={styles.content}>
                <Text style={styles.nameThree}>{title}</Text>
            </View>
        </Pressable>
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
        backgroundColor: '#1a1a1f',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 16,
        padding: 16,
        shadowColor: 'rgba(255, 0, 0, 0.33)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 100,
    },
    titleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1f',
        borderWidth: 1,
        borderColor: 'rgba(20, 133, 95, 0.44)',
        borderRadius: 10,
        padding: 12,
        shadowColor: '#00778017',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 100,
        marginHorizontal: 16,
        marginVertical: 8,
        gap: 12,
    },
    titleCardScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1f',
        borderWidth: 1,
        borderColor: 'rgba(20, 133, 95, 0.44)',
        borderRadius: 10,
        padding: 12,
        shadowColor: '#00778017',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 5,
        marginHorizontal: 10,
        marginVertical: 2,
        gap: 2,
        width: 330,
    },
    titleCardLinked: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1f',
        borderWidth: 1,
        borderColor: 'rgba(211, 28, 28, 0.18)',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#ff0000e1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 50,
        elevation: 200,
        marginHorizontal: 12,
        marginVertical: 8,
        gap: 12,
    },
    content: {
        flexDirection: 'column',
        flex: 1,
    },
    avatar: {
        width: 77,
        height: 77,
        borderRadius: 37,
        marginRight: 14,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'green',
    },
    name: {
        fontFamily: fonts.regular,
        fontSize: 20,
        color: 'white',
    },
    nameTwo: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    nameThree: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: 'white',
        textAlign: 'left',
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
        fontSize: 11,
        textAlign: 'left',
        marginVertical: 2,
        color: 'grey',
    },
    description: {
        fontFamily: fonts.italic,
        fontSize: 10,
        textAlign: 'center',
        marginVertical: 2,
        color: 'grey',
    },
    uName: {
        fontFamily: fonts.uName,
        fontSize: 14,
        textAlign: 'left',
        color: 'rgba(255, 253, 116, 0.58)',
    },
    button: {
        marginTop: 10,
        marginHorizontal: 8,
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#1a1a1f',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.07)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 100,
    },
    buttonText: {
        fontFamily: fonts.regular,
        color: '#fff',
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