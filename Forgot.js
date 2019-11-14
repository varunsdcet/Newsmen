import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput, View,Image,SafeAreaView ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';
import * as EmailValidator from 'email-validator';
const GLOBAL = require('./Global');
import DeviceInfo from 'react-native-device-info';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Forgot extends Component {
    state = {
        text: '',
        otp:'',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        loading:'',
        states:'',
        results: [],

    };

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


    showLoading() {
        this.setState({loading: true})
    }

    componentWillMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ status: isConnected });

            }
        );
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {

        this.setState({ status: isConnected });
        if (this.state.status == false){
            alert('You are not connected to Internet')
        }
        console.log(`is connected: ${this.state.status}`);
    }

    _handlePress = () => {
        this.props.navigation.navigate('TabNavigators')
    }

    hideLoading() {
        this.setState({loading: false})
    }
    buttonClickListener = () =>{

        if (this.state.username == ''){
            alert('Please Enter Email Address')
        }

        else if (EmailValidator.validate(this.state.username) == false){
            alert('Please Enter valid Email')
        }
        else {
            const url = GLOBAL.BASE_URL +  'Forget_password'
            this.showLoading()
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.username,


                }),
            }).then((response) => response.json())
                .then((responseJson) => {


                    this.hideLoading()
                    if (responseJson.status == true) {

                        alert('Password Sent To Your Registered Email Address.')
                        this.props.navigation.goBack();
                    }else {
                        alert('Your Email Address is Not Registered.')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }

    }

    componentDidMount(){
    }


    render() {

        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style = {styles.loading}
                                       size="large" color='#c13e44' />
                </View>
            )
        }

        return (
            <SafeAreaView>
            <View >

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                    <KeyboardAwareScrollView>


                        <View style = {{flexDirection:'row',width:window.width,marginTop:30}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>
                        </View>


                        <Text style = {{color:'black',fontWeight: 'bold',marginTop:90,fontSize: 22,textAlign:'center'}}>
                           Forgot Password
                        </Text>

                        <Text style = {{color:'black',marginTop:30,fontSize: 14,textAlign:'center'}}>
                            Enter the email address you used to create an account and we will send instruction on how to reset your password

                        </Text>

                        <View style = {{flexDirection:'row',marginTop:40,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./message.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}
                                       onChangeText={(text) => this.setState({username:text})}
                                       placeholder = "Enter Email "
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                            />



                        </View>



                        <Button
                            style={{ fontSize: 14, color: 'white' }}
                            containerStyle={{ marginTop:20,marginLeft:15,width:window.width-30,padding: 14, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44',margin:15}}

                            onPress={() => this.buttonClickListener()}
                        >
                            SUBMIT
                        </Button>





                    </KeyboardAwareScrollView>

                </View>

            </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,

    },
    slide1: {

        marginLeft : 50,

        width: window.width - 50,
        height:300,
        resizeMode:'contain',
        marginTop : window.height/2 - 200


    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})
