import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    View,
    Image,
    Alert,
    AsyncStorage,
    Dimensions,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    FlatList,
    WebView
} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';
const GLOBAL = require('./Global');

var url = GLOBAL.BASE_URL + 'about_us'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class About extends Component {
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


    state = {
        text: '',movies:"",
    };


    showLoading() {
        this.setState({loading: true})
    }



    getMoviesFromApiAsync() {
//  alert(url)
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
//      alert(JSON.stringify(responseJson))
                if(responseJson.status ==true){
                    this.setState({movies: responseJson.about})

                }
                else{
                    alert('Something went wrong!')
                }
//      return responseJson.movies;
            })
            .catch((error) => {
                console.error(error);
            });
    }



    componentWillMount() {
        this.getMoviesFromApiAsync()

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



    render() {


        return (
            <View style={styles.container}>

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,flex:1}}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                        <View style = {{flexDirection:'row',width:window.width,marginTop:55}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'column', margin:10}}>
                            <Text style={{color:'black',fontSize:30,fontWeight:'bold', width:window.width-20, height:'auto',    textDecorationLine: 'underline',}}>About Us</Text>

                            <Text style={{color:'black', fontSize:20,  width:'100%', textAlign:'justify', marginTop:10, lineHeight:30}}>
                                We live in an age of digital information where phones are the inevitable source of limitless and constant news. With adults struggling to keep pace, is it any wonder that high school students with their packed schedules and high academic pressures miss out on vital current affairs? The idea for The Newsmen evolved as a response to this situation.
                            </Text>

                            <Text style={{color:'black', fontSize:20,  width:'100%', textAlign:'justify', marginTop:10, lineHeight:30}}>
                                It is a platform where young people can subscribe to bite-sized news articles encompassing global affairs, politics, entertainment, and even the latest buzz from local high schools.  It provides a safe and exclusive space for users to form personal groups to voice their opinions and carry out discussions on topics of societal importance. The Newsmen aims to be the first stop for the curious youth to stay updated on trending and viral news stories that can be consumed and shared in seconds. With the freedom to deliver one’s thoughts and deliberate on them with other users, The Newsmen aspires to be the means for engaging in a fun and constructive learning process. It doesn’t promise to make you an expert but it guarantees you will have no more ignorance!
                            </Text>

                            <Text style={{color:'black',fontSize:30,fontWeight:'bold', width:window.width-20, height:'auto',    textDecorationLine: 'underline',marginTop: 30,
                            }}>Our Team</Text>

                            <Text style={{color:'black', fontSize:20,  width:'100%', textAlign:'justify', marginTop:10, lineHeight:30}}>
                                Shriraj  Singal’s vision of creating a digital news platform with debates and discussions found immediate support from Aishwarya Singal Munjal, Masters in Finance & Risk Management, from Columbia University, journalist Anandita Bhardwaj and tech-expert Akshat Rana. The collaborative efforts from the team continues to work in establishing an interactive forum for the students and great experience for every single visitor.
                            </Text>
                        </View>

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