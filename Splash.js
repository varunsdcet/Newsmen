import React, {Component} from 'react';
import { StyleSheet,TextInput,Text, View,Image, Linking,Button ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,Animated,  Easing,AppState,ImageBackground} from 'react-native';
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import NotifService from './NotifService';
type Props = {};
export default class Splash extends Component {
    constructor(props) {

        super(props)
        this.state = {
            moviesList: [],
            eventLists :[],
            brandLists: [],
            moviesLists: [],
            beer: [],
            count : "0",
            oldpass:'',
            newpass:'',
            confpass:'',
        }
        this.RotateValueHolder = new Animated.Value(0);
        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));

    }
    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null,
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
        }
    }



    onRegister(token) {


        GLOBAL.deviceToken =  token.token;
        this.setState({ registerToken: token.token, gcmRegistered: true });
    }

    onNotif(notif) {
        //   alert(AppState.currentState)

     //   alert(JSON.stringify(notif))
        console.log(notif);
        //Alert.alert(notif.title, notif.message);
    }

    handlePerm(perms) {
        Alert.alert("Permissions", JSON.stringify(perms));
    }
    componentDidMount(){

        var values =  AsyncStorage.getItem('name');
        values.then((e)=>{
            if (e == '' || e == null ){



            }else {
                GLOBAL.myname = e;
            }

        })



        var value =  AsyncStorage.getItem('userID');
        value.then((e)=>{
            if (e == '' || e == null ){


                this.props.navigation.replace('TabNavigators')
            }else {
                GLOBAL.user_id = e;
                this.props.navigation.replace('TabNavigators')
            }

        })
    }



    StartImageRotateFunction() {
        this.RotateValueHolder.setValue(0);
        Animated.timing(this.RotateValueHolder, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
        }).start(() => this.StartImageRotateFunction());
    }

    render() {
        const RotateData = this.RotateValueHolder.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '30deg'],
        });
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('./splash.png')}
                    style={{width: '100%', height: '100%'}}
                >
                <Image
                    style={{
                        width: 182,
                        height: 250,
                        alignSelf:'center',
                        resizeMode:'contain',
                        marginTop :window.height/2 - 125,


                    }}
                    source={require('./splashs.png')}
                />
                </ImageBackground>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        borderWidth: 1,
        borderColor: "#000000",
        margin: 5,
        padding: 5,
        width: "70%",
        backgroundColor: "#DDDDDD",
        borderRadius: 5,
    },
    textField: {
        borderWidth: 1,
        borderColor: "#AAAAAA",
        margin: 5,
        padding: 5,
        width: "70%"
    },
    spacer: {
        height: 10,
    },

    title: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
    }
});
