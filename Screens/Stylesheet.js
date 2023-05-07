import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        margin: 15
    },

    tittletext: {
        textAlign: 'center',
        fontSize: 20,
    },

    button: {
        margin: 15,
        backgroundColor: '#02f2de',
        borderRadius: "12px",
        alignItems: 'center' 
    },

    messagestyle: {
        border: "2px solid #3764c4",
        borderRadius: "12px",
        padding: "5px",
        backgroundColor: "#e6e3e3",
        marginBottom: 10
    },

    messagetext: {
        fontSize: 30,
        margin: 15
    },

    sendbutton: {
        margin: 15,
        backgroundColor: '#3764c4',
        position: 'relative',
        border: "2px solid #3764c4",
        borderRadius: "12px",
        padding: "5px",
        alignSelf: 'flex-end',
        right: 0,
    },

    textinput: {
        fontSize: 20,
        margin: 15,
        border: "2px solid black",
        borderRadius: "12px",
        padding: "5px",
    },

    infotext: {
        fontSize: 20,
        margin: 3
    },


    sendmessage: {
        fontSize: 20,
        margin: 15,
        border: "2px solid black",
        borderRadius: "12px",
        padding: "5px",
        width: 275,
        alignSelf: 'flex-start',
    },

    image: {
        width: 400,
        height: 400
    },

    container: {
        flex: 1
    },
    
    buttonContainer: {
        alignSelf: 'flex-end',
        padding: 5,
        margin: 5,
        backgroundColor: 'steelblue'
    },
})

export default styles;