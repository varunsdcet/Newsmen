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
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    FlatList
} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Setting extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        newsHeading :['About Us','Change Password','LogOut'],
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


    _renderItemCategs = (item,index)=>{


        return (

            <View style = {{backgroundColor:'transparent'}}>


                <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:window.width- 30,
                    backgroundColor:'transparent',padding:5}}>
                    <Image style = {{width :window.width- 30 ,height : 200  }}
                           source={require('./splash.png')}/>


                </View>



            </View>

        )
    }


    _renderItemCateg = (item,index)=>{


        return (

            <View>


                <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:100,
                    backgroundColor:'white',padding:5}}>
                    <Image style = {{width :30 ,height : 80 ,padding:12,margin:5 ,borderRadius:40 }}
                           source={require('./splash.png')}/>
                    <Text style = {{fontSize: 16,marginBottom:2,fontWeight:'bold',alignSelf:'center'}}>
                        {item.item}
                    </Text>

                </View>



            </View>

        )
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
    _resPress = (index) =>{
        if (index == 0){
            this.props.navigation.navigate('About')
        }else if (index== 1){
            this.props.navigation.navigate('Password')
        }
    }
    _renderItemCategs = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this._resPress(item.index)}>


                <View style = {{margin :5 ,backgroundColor:'white',width:window.width,
                    justifyContent:'space-between',flexDirection:'row'}}>







                        <Text style = {{fontSize:18,fontWeight:'bold',marginLeft:7}}>
                            {item.item}
                        </Text>








                        <Image style = {{width :20 ,height : 20,resizeMode:'contain',marginRight:20,marginTop:4,alignSelf: 'flex-end'}}
                               source={require('./settingarrow.png')}/>





                </View>


                <View style = {{backgroundColor:'grey',height:1,marginBottom:10}}>
                </View>

            </TouchableOpacity>


        )
    }
    render() {


        return (
            <SafeAreaView >
            <View >

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                    <KeyboardAwareScrollView>

                        <View style = {{flexDirection:'row',width:window.width,marginTop:50}}>

                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>



                            <Text style = {{marginLeft:40,fontSize: 20,color:'#c13e44',fontWeight: 'bold'}}>
                                Settings
                            </Text>






                        </View>




                        <FlatList style= {{marginTop:40, marginBottom: 10,backgroundColor:'transparent'}}
                                  data={this.state.newsHeading}


                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCategs}
                        />





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