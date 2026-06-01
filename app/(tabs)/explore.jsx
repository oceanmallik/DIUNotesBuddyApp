import { StyleSheet, Text, View } from 'react-native'

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Us</Text>
    </View>
  )
}

export default AboutUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Times New Roman',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})