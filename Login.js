import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,SafeAreaView, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';

const GLOBAL = require('./Global');
import DeviceInfo from 'react-native-device-info';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Login extends Component {
    state = {
        text: '',
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
      GLOBAL.user_id =''
        this.props.navigation.replace('TabNavigators')
    }
    _handlePresss= () =>{
        this.props.navigation.navigate('Forgot')
    }
    hideLoading() {
        this.setState({loading: false})
    }
    buttonClickListener = () =>{
//      alert(GLOBAL._token)
        var k =  AsyncStorage.getItem('token');
        DeviceInfo.getIPAddress().then(ip => {
            this.setState({ipAdd:ip})
        });
        if (this.state.username == ''){
            alert('Please Enter Username')
        }    else if (this.state.password == '') {
            alert('Please Enter Password')
        }  else {
            const url = GLOBAL.BASE_URL +  'Signin'
            this.showLoading()
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: this.state.username,
                    password: this.state.password,
                    deviceID: DeviceInfo.getUniqueID(),
                    deviceType: Platform.OS,
                    deviceToken:  GLOBAL.deviceToken,
                    model_name: DeviceInfo.getModel(),
                    carrier_name: DeviceInfo.getCarrier(),
                    device_country: DeviceInfo.getDeviceCountry(),
                    device_memory: DeviceInfo.getTotalMemory(),
                    has_notch: DeviceInfo.hasNotch(),
                    manufacture: DeviceInfo.getManufacturer(),
                    ip_address: this.state.ipAdd,
                }),
            }).then((response) => response.json())
                .then((responseJson) => {

                    this.hideLoading()
                    if (responseJson.status == true) {
                        this.setState({ results: responseJson.user_detail })
                        GLOBAL.user_id = this.state.results.user_id
                        AsyncStorage.setItem('userID', this.state.results.user_id);
                        AsyncStorage.setItem('image', this.state.results.image);
                        AsyncStorage.setItem('name', this.state.results.name);
                        AsyncStorage.setItem('email', this.state.results.email);
                        AsyncStorage.setItem('mobile', this.state.results.mobile);
                        this.props.navigation.replace('TabNavigators')
                    }
                    else{
                        alert('Invalid Credentials!')
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
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>


                    <Text style = {{color:'black',fontWeight: 'bold',marginTop:120,fontSize: 22,textAlign:'center'}}>
                        Sign In
                    </Text>

                        <View style = {{flexDirection:'row',marginTop:40,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./message.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}
                                       onChangeText={(text) => this.setState({username:text.replace(/\s+/g,'')})}
                                       placeholder = "Username"
                                       value={this.state.username}
                                       autoCapitalize = 'none'
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                                       />



                        </View>

                        <View style = {{flexDirection:'row',marginTop:20,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./key.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}
                                       onChangeText={(text) => this.setState({password:text})}
                                       placeholder = "Password"
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                                       secureTextEntry={true}
                            />



                        </View>

                        <Button
                            style={{ fontSize: 14, color: 'white' }}
                            containerStyle={{ marginTop:20,marginLeft:15,width:window.width-30,padding: 14, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44',margin:15}}

                            onPress={() => this.buttonClickListener()}
                        >
                            Login
                        </Button>

                        <Button
                            style={{ fontSize: 18, color: 'black' }}
                            containerStyle={{ marginTop:-2,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: 'white',margin:15}}

                            onPress={() => this._handlePresss()}
                        >
                            Forgot Password ?
                        </Button>


                        <Button
                            style={{ fontSize: 14, color: 'white' }}
                            containerStyle={{ marginTop:-2,marginLeft:15,width:window.width-30,padding: 14, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#3a59d6',margin:15}}

                            onPress={() => this._handlePress()}
                        >
                            SKIP
                        </Button>

                        <Text style = {{color:'black',fontWeight: 'bold',marginTop:20,fontSize: 14,textAlign:'center'}}>
                            Don't have an account yet ?
                        </Text>

                        <Button
                            style={{ fontSize: 16, color: '#3a59d6' }}
                            containerStyle={{ marginTop:0,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: 'white',margin:15}}

                            onPress={() => this.props.navigation.navigate('Signup')}
                        >
                            Sign up now
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
