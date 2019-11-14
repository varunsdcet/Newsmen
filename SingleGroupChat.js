import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,Keyboard,FlatList, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator,SafeAreaView} from 'react-native';
const window = Dimensions.get('window');
import Video from 'react-native-video';
import Button from 'react-native-button';
import * as Progress from 'react-native-progress';
const GLOBAL = require('./Global');
import { createStackNavigator ,createAppContainer ,createDrawerNavigator} from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Svg, { Path } from "react-native-svg";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
type Props = {};
var catid = "1";
var s = '0';
export default class SingleGroupChat extends Component {
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
        answer : true,
        array :[
            {
                title :'News',
                selected:'Y',
                color :'red'
            },
            {
                title :'High Flyer',
                selected:'',
                color :'blue'
            },
            {
                title :'View Point',
                selected:'',
                color :'#c13e44'
            },
            {
                title :'Entertain Me',
                selected:'',
                color :'purple'
            },
            {
                title :'Hign School News',
                selected:'',
                color :'orange'
            },




        ],
        newsHeading :[],
        news :[],
        selected :[],
        height:0,

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


    getNewsIntially(){

        //news_comment_reply_list'

        if (s == '0') {

            const url = GLOBAL.BASE_URL + 'group_comment_reply_list'


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: GLOBAL.user_id,
                    comment_id: GLOBAL.comment_id,

                }),
            }).then((response) => response.json())
                .then((responseJson) => {


                    if (responseJson.status == true) {


                        this.setState({news: responseJson.get_comment_list})
                        this.getNewsIntially()

                    } else {
                        alert('No News Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

        }



    }
    getNewsUpdate(){


    }
    getNewsUpdateMore(){


    }


    componentWillMount() {
        s = '0';
        this.getNewsIntially()
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ status: isConnected });

            }
        );
    }
    componentWillUnmount() {
        s = '1';
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {

        this.setState({ status: isConnected });
        if (this.state.status == false){
            alert('You are not connected to Internet')
        }
        console.log(`is connected: ${this.state.status}`);
    }



    change = () =>{
        this.setState({answer:!this.state.answer})
    }

    hideLoading() {
        this.setState({loading: false})
    }




    _renderItemCategs = (item,index)=> {




        return (
            <View>


                {item.item.is_user_edit == 1 && (

                    <View style={[styles.item, styles.itemOut]}>
                        <View style={[styles.balloon, {backgroundColor: '#1084ff'}]}>
                            <Text style={{paddingTop: 5, color: 'white'}}>{item.item.reply}</Text>

                            <View
                                style={[
                                    styles.arrowContainer,
                                    styles.arrowRightContainer,
                                ]}
                            >
                                <Svg style={styles.arrowRight} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.485 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
                                    <Path
                                        d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                                        fill="#1084ff"
                                        x="0"
                                        y="0"
                                    />
                                </Svg>
                            </View>

                            <Text style={{paddingTop: 5, color: 'black'}}>{item.item.reply_time}</Text>
                        </View>

                    </View>


                )}
                {item.item.is_user_edit != 1 && (
                    <View style={[styles.item, styles.itemIn]}>
                        <View style={[styles.balloon, {backgroundColor: 'grey'}]}>
                            <Text style={{paddingTop: 5, color: 'white'}}>{item.item.reply}</Text>
                            <Text style={{paddingTop: 5, color: 'black'}}>{item.item.user_name}</Text>
                            <View
                                style={[
                                    styles.arrowContainer,
                                    styles.arrowRightContainer,
                                ]}
                            >
                                <Svg style={styles.arrowLeft} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.484 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
                                    <Path
                                        d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                                        fill="grey"
                                        x="0"
                                        y="0"
                                    />
                                </Svg>
                            </View>
                            <Text style={{paddingTop: 5, color: 'black'}}>{item.item.reply_time}</Text>
                        </View>

                    </View>

                )}


            </View>

        )
    }

    getChat =()=>{




        if (this.state.msg == ''){
            alert('Please enter Message')
            return
        }
        const url = GLOBAL.BASE_URL +  'reply_group_comment'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment_id : GLOBAL.comment_id,
                user_id : GLOBAL.user_id,
                reply :this.state.msg


            }),
        }).then((response) => response.json())
            .then((responseJson) => {
              //  alert(JSON.stringify(responseJson))

                if (this.state.status == true){

                //    Keyboard.dismiss()

                    this.setState({msg:''})
                    this.setState({news:responseJson.reply_comment_list})
                }else{

                }


            })
            .catch((error) => {
                console.error(error);
            });

    }



    componentDidMount(){
    }
    handleLoadMore = () => {
        if (!this.state.loading) {
            this.page = this.page + 1; // increase page by 1
            // method for API call
        }
    };
    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    };
    render() {


        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <View >
                    <View style = {{flexDirection:'row',width:window.width,marginTop:10}}>

                        <TouchableOpacity style = {{width :30 ,height : 30 }}
                                          onPress={() => this.props.navigation.goBack()}>
                            <Image style = {{width :30 ,height : 30 ,marginLeft: 20,resizeMode: 'contain'}}
                                   source={require('./arrow.png')}/>
                        </TouchableOpacity>



                        <Text style = {{marginLeft:40,fontSize: 20,color:'#c13e44',fontWeight: 'bold'}}>
                            {GLOBAL.comment}
                        </Text>



                    </View>


                    <KeyboardAwareScrollView
                        enableAutomaticScroll = {true}
                        scrollEnabled={false}
                        keyboardShouldPersistTaps='always'
                    >

                        <FlatList style= {{marginTop:5,height:window.height - 108 ,marginBottom:40}}
                                  data={this.state.news}


                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCategs}
                                  ListFooterComponent={this.renderFooter.bind(this)}
                                  onEndReachedThreshold={0.4}
                                  ref={ref => this.flatList = ref}
                                  onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
                                  onLayout={() => this.flatList.scrollToEnd({animated: true})}

                                  onEndReached={this.handleLoadMore.bind(this)}
                        />


                        <View style={[{height: 50,padding: 4,width:window.width ,position:'absolute',bottom:0,backgroundColor :'#dbdad6',flexDirection:'row',justifyContent:'space-between'}, {height: Math.max(40, this.state.height + 2 )}]}>


                            <TextInput
                                multiline={true}
                                autoCorrect = {false}
                                placeholder = {'Send Message ...'}
                                value = {this.state.msg}
                                onContentSizeChange={(event) => {
                                    this.setState({height: event.nativeEvent.contentSize.height});
                                }}

                                onChangeText={(text) => this.setState({msg:text})}
                                style={[{height: 50,borderWidth: 0.0,borderColor: '#0f0f0f',fontSize: 16,padding: 4,width:window.width - 100}, {height: Math.max(40, this.state.height)}]}
                                defaultValue={this.state.value}
                            />


                            <Button
                                style={{ fontSize: 18, color: 'black',alignSelf:'flex-end',marginRight:2 }}
                                containerStyle={{ width:70,padding: 10, height: 45, overflow: 'hidden' ,marginLeft:15}}

                                onPress={() => this.getChat()}
                            >
                                SEND
                            </Button>
                        </View>

                    </KeyboardAwareScrollView>
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
    },
    video: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    textStyle: {
        color: '#fff',
        fontSize: 18,
    },
    item: {
        marginVertical: moderateScale(7, 2),
        flexDirection: 'row'
    },
    itemIn: {
        marginLeft: 20
    },
    itemOut: {
        alignSelf: 'flex-end',
        marginRight: 20
    },
    balloon: {
        maxWidth: moderateScale(250, 2),
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(5, 2),
        paddingBottom: moderateScale(7, 2),
        borderRadius: 20,
    },
    arrowContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        flex: 1
    },
    arrowLeftContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },

    arrowRightContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    arrowLeft: {
        left: moderateScale(-6, 0.5),
    },

    arrowRight: {
        right:moderateScale(-6, 0.5),
    }
})