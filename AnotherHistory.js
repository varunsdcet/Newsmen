import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,FlatList, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator,SafeAreaView} from 'react-native';
const window = Dimensions.get('window');
import Video from 'react-native-video';
import Button from 'react-native-button';
const GLOBAL = require('./Global');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};

export default class AnotherHistory extends Component {
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
        newsHeading :['Application','Novel','Stock',"Topic","Election"],
        selected :[],
        author :[],
        tag :[],

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
    _handleCategorySelect = (item,index) => {

        var array = this.state.selected
        var c = array.push(item.item)


        this.setState({selected:c})



    }

    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'recent_activity_history'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,
                types :'news'

            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                //  alert(JSON.stringify(responseJson))



                if (responseJson.status == true) {
                    this.setState({author:responseJson.history})
                    //
                    // this.setState({tag:responseJson.tags_list})



                }else {
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    author = (item,index) => {



        if (item.type == "news"){
            GLOBAL.newsid = item.news_id
            this.props.navigation.navigate('NewsDetail')
        } else if( item.type == "normal") {
            GLOBAL.another = item.receiver_id
            this.props.navigation.navigate('SingleChat')
        }else{
            GLOBAL.groupId = item.group_id

            this.props.navigation.navigate('ChatGroup')
        }

    }
    authors = (item,index) => {
        GLOBAL.author_id = ''
        GLOBAL.type = ''
        GLOBAL.keyword = item
        GLOBAL.author = item
        this.props.navigation.navigate('DiscoverDetail')

    }

    _renderItemCategs = (item,index)=>{
        //  alert(JSON.stringify(item.item))



        return (
            <TouchableOpacity
                onPress={() => this.author(item.item,index)}>

                {item.item.type == 'normal' && (
                    <View style = {{margin :10 ,backgroundColor:'white',width:window.width,
                        flexDirection:'row'}}>
                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.receiver_image}}/>

                        <View style = {{flexDirection:'column',width:'75%',marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>
                                {item.item.receiver_name}
                            </Text>

                            <Text style = {{color:'#cdcdcd'}}>
                                {item.item.message}
                            </Text>

                        </View>
                    </View>
                )}

                {item.item.type == 'group_post' && (
                    <View style = {{margin :10 ,backgroundColor:'white',width:window.width,
                        flexDirection:'row'}}>
                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.image}}/>

                        <View style = {{flexDirection:'column',width:'75%',marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>
                                {item.item.group_name}
                            </Text>

                            <Text style = {{color:'#cdcdcd'}}>
                                {item.item.comment}
                            </Text>

                        </View>

                    </View>
                )}

                {item.item.type == 'news' && (
                    <View style = {{margin :10 ,backgroundColor:'white',width:window.width,
                        flexDirection:'row'}}>

                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.image}}/>

                        <View style = {{flexDirection:'column',width:'75%',marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>
                                {item.item.news_title}
                            </Text>

                            <Text style = {{color:'#cdcdcd'}}>
                                {item.item.comment}
                            </Text>

                        </View>
                    </View>
                )}


                <View style={{height:1, backgroundColor:'grey', width:window.width-20,marginLeft:10,marginTop:-10}}>
                </View>


            </TouchableOpacity>


        )
    }



    componentDidMount(){
        this.getNewsUpdate()
    }


    render() {


        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <KeyboardAwareScrollView>

                    <View style = {{flexDirection:'row',width:window.width,marginTop:20}}>
                        <TouchableOpacity style = {{width :30 ,height : 30 }}
                                          onPress={() => this.props.navigation.goBack()}>
                            <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                   source={require('./arrow.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style = {{flexDirection:'row',width:window.width,justifyContent:'space-between',marginTop:2}}>

                        <Text style = {{fontSize: 34,color:'black',fontWeight: 'bold',margin:10}}>
                            Recent Activities
                        </Text>



                    </View>


                    <View style = {{width:window.width,height:'auto'}}>

                        <FlatList style= {{marginTop:10, marginBottom: 10}}
                                  data={this.state.author}


                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCategs}
                        />

                    </View>

                </KeyboardAwareScrollView>
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
})