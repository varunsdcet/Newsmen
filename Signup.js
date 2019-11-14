import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,SafeAreaView, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';
var randomString = require('random-string');
import DeviceInfo from 'react-native-device-info';
const GLOBAL = require('./Global');
import * as EmailValidator from 'email-validator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Signup extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        email : '',
        mobile : '',
        status : '',
        iPAddress : '',
        loading:'',
        results: [],
        name:'',

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


    buttonClickListener = () =>{
        DeviceInfo.getIPAddress().then(ip => {
            this.setState({iPAddress:ip})
        });
        GLOBAL.myname = this.state.username
        GLOBAL.usernames = this.state.name
        GLOBAL.mymobile= this.state.mobile
        GLOBAL.myemail= this.state.email
        GLOBAL.mypassword= this.state.password
        GLOBAL.mydeviceID= DeviceInfo.getUniqueID()
        GLOBAL.mydeviceType= Platform.OS
        GLOBAL.mydeviceToken= GLOBAL.token
        GLOBAL.mymodel_name= DeviceInfo.getModel()
        GLOBAL.mycarrier_name= DeviceInfo.getCarrier()
        GLOBAL.mydevice_country= DeviceInfo.getDeviceCountry()
        GLOBAL.mydevice_memory= DeviceInfo.getTotalMemory()
//EmailValidator.validate("test@email.com");
        if (this.state.username == ''){
            alert('Please Enter Username')
        }
        else if (this.state.name == ''){
            alert('Please Enter Username')
        }
        else if (this.state.mobile == ''){
            alert('Please Enter Mobile')
        }   else if (this.state.password == '') {
            alert('Please Enter Password')
        }  else {
            var x = randomString({
                length: 6,
                numeric: true,
                letters: false,
                special: false,
            });
            if (this.state.mobile == ''){
                alert('Please Enter Mobile Number')
            }    else {
                const url = GLOBAL.BASE_URL +  'otp'

                this.showLoading()
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email : this.state.email,
                        mobile: this.state.mobile,
                        otp:x,
                        username:this.state.name,
                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {
                        this.hideLoading()
                        if (responseJson.status == true) {
                            GLOBAL.otps =  x;
                            GLOBAL.fmobile= this.state.mobile;
                            GLOBAL.isScreen = '0';
                            alert('OTP Sent To Your Registered Mobile Number.')
                            this.props.navigation.navigate('Otp')
                        }else {
                            alert('Your Mobile Number Is Already Registered.')
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    }
    hideLoading() {
        this.setState({loading: false})
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


                        <View style = {{flexDirection:'row',width:window.width,marginTop:30}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>
                        </View>

                        <Text style = {{color:'black',fontWeight: 'bold',marginTop:90,fontSize: 22,textAlign:'center'}}>
                            Sign up
                        </Text>



                        <View style = {{flexDirection:'row',marginTop:40,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./name.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}

                                       placeholder = "Name"
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                                       onChangeText={(text) => this.setState({username:text})}
                            />



                        </View>

                        <View style = {{flexDirection:'row',marginTop:40,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./name.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}

                                       placeholder = "UserName"
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                                       onChangeText={(text) => this.setState({name:text})}
                            />



                        </View>







                        <View style = {{flexDirection:'row',marginTop:20,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./message.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}

                                       placeholder = "Email"
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                                       onChangeText={(text) => this.setState({email:text.replace(/\s+/g,'')})}
                                       value={this.state.email}

                            />



                        </View>

                        <View style = {{flexDirection:'row',marginTop:20,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./mobile.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}

                                       placeholder = "Mobile Number"
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                                       keyboardType={'numeric'}
                                       maxLength={10}
                                       onChangeText={(text) => this.setState({mobile:text.replace(/[^0-9]/g, '')})}
                                       value={this.state.mobile}

                            />



                        </View>

                        <View style = {{flexDirection:'row',marginTop:20,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'black',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./key.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'black', height:50}}

                                       placeholder = "Password"
                                       placeholderTextColor = "black"
                                       autoCapitalize = "none"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({password:text})}
                            />



                        </View>

                        <Button
                            style={{ fontSize: 16, color: 'white' }}
                            containerStyle={{ marginTop:20,marginLeft:15,width:window.width-30,padding: 14, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#3a59d6',margin:15}}

                            onPress={() => this.buttonClickListener()}
                        >
                            Register
                        </Button>




                        <Text style = {{color:'black',fontWeight: 'bold',marginTop:20,fontSize: 14,textAlign:'center'}}>
                            Don't have an account  ?
                        </Text>

                        <Button
                            style={{ fontSize: 16, color: '#3a59d6' }}
                            containerStyle={{ marginTop:0,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: 'white',margin:15}}

                            onPress={() => this.props.navigation.goBack()}
                        >
                            Sign In
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
