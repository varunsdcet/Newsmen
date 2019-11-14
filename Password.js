import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';
const GLOBAL = require('./Global');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Password extends Component {
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



    hideLoading() {
        this.setState({loading: false})
    }

    componentDidMount(){
    }

    buttonClickListener = () =>{

        if (this.state.username == ''){
            alert('Please Enter Old Password ')
        }    else if (this.state.password == '') {
            alert('Please Enter New Password')
        } else if (this.state.passwordtext == '') {
            alert('Please Enter Confirm Password')
        }else if (this.state.passwordtext != this.state.password) {
            alert('Password Not Match')
        }



        else {
            const url = GLOBAL.BASE_URL +  'change_password'
            this.showLoading()
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: GLOBAL.user_id,
                    old_password: this.state.username,
                    new_password: this.state.passwordtext,

                }),
            }).then((response) => response.json())
                .then((responseJson) => {

                    this.hideLoading()
                    if (responseJson.status == true) {
                        this.props.navigation.goBack()

                    }
                    else{
                        alert('Unable to process your request. Please try again later')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    render() {


        return (
            <View style={styles.container}>

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                    <KeyboardAwareScrollView>
                        <View style = {{flexDirection:'row',width:window.width,marginTop:50,justifyContent:'space-between'}}>

                            <View>
                                <TouchableOpacity style = {{width :30 ,height : 30 }}
                                                  onPress={() => this.props.navigation.goBack()}>
                                    <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                           source={require('./arrow.png')}/>
                                </TouchableOpacity>
                            </View>








                        </View>
                        <Image style = {{width :100,height : 100,marginLeft:window.width/2 - 50,marginTop:30}}
                               source={require('./change.png')}/>
                        <Text style = {{color:'black',fontWeight: 'bold',marginTop:30,fontSize: 26,textAlign:'center'}}>
                           Change Password
                        </Text>

                        <View style = {{flexDirection:'row',marginTop:20,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'#cdcdcd',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./key.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'#cdcdcd', height:50}}

                                       placeholder = "OLD PASSWORD"
                                       placeholderTextColor = "#cdcdcd"
                                       autoCapitalize = "none"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({username:text})}
                            />



                        </View>

                        <View style = {{flexDirection:'row',marginTop:20,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'#cdcdcd',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./key.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'#cdcdcd', height:50}}

                                       placeholder = "NEW PASSWORD"
                                       placeholderTextColor = "#cdcdcd"
                                       autoCapitalize = "none"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({password:text})}
                            />



                        </View>

                        <View style = {{flexDirection:'row',marginTop:20,marginLeft: 15,width:window.width - 30,borderWidth:1,height:50,borderColor:'#cdcdcd',borderRadius:30, shadowColor: '#f5f5f5',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2}}>
                            <Image style = {{margin :12,height:25,width:25 ,resizeMode:'contain'}}
                                   source={require('./key.png')}/>
                            <TextInput style = {{width:window.width-80,marginLeft:5,fontWeight:'bold',color:'#cdcdcd', height:50}}

                                       placeholder = "CONFIRM PASSWORD"
                                       placeholderTextColor = "#cdcdcd"
                                       autoCapitalize = "none"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({passwordtext:text})}
                            />



                        </View>


                        <Button
                            style={{ fontSize: 20, color: 'white' }}
                            containerStyle={{ marginTop:20,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44',margin:15}}

                            onPress={() => this.buttonClickListener()}
                        >
                            SAVE
                        </Button>





                    </KeyboardAwareScrollView>

                </View>

            </View>
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
