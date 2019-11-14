import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,FlatList, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator,SafeAreaView} from 'react-native';
const window = Dimensions.get('window');
import Video from 'react-native-video';
import Button from 'react-native-button';
const GLOBAL = require('./Global');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};

export default class Discover extends Component {
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
        const url = GLOBAL.BASE_URL +  'discover'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {



                if (responseJson.status == "true") {
                    this.setState({author:responseJson.author})

                    this.setState({tag:responseJson.tags_list})



                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    author = (item,index) => {
        GLOBAL.author_id = item.author_id
        GLOBAL.type = 'author'
        GLOBAL.keyword = ''
        GLOBAL.author = item.author_name
        this.props.navigation.navigate('DiscoverDetail')

    }
    authors = (item,index) => {
        GLOBAL.author_id = ''
        GLOBAL.type = ''
        GLOBAL.keyword = item
        GLOBAL.author = item
        this.props.navigation.navigate('DiscoverDetail')

    }

    _renderItemCategs = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this.author(item.item,index)}>


                <View style = {{marginLeft :8 ,marginRight:8,marginBottom:8,backgroundColor:'white',width:80,height:80,borderRadius:50,padding:5

                }}>

                    <Image style = {{width :80 ,height : 80 ,padding:4,borderRadius:40,alignSelf:'center' }}
                           source={{uri :item.item.author_image}}/>

                </View>
                <Text style = {{fontSize:15,alignSelf:'center', width:80, textAlign:'center'}}>
                    {item.item.author_name}
                </Text>



            </TouchableOpacity>


        )
    }

    _renderItemCateg = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this.authors(item.item,index)}>




                <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:1,flexDirection:'row',
                    backgroundColor:'white',padding:5,width:window.width - 20}}>

                    <View style = {{width :40 ,height : 40 ,padding:10,margin:5 ,borderRadius:30,backgroundColor:'#ff0012' }}>

                        <Text style = {{fontSize: 16,fontWeight:'bold',alignSelf:'center',color:'white'}}>
                            #
                        </Text>
                    </View>



                    <Text style = {{fontSize: 16,marginBottom:1,fontWeight:'bold',alignSelf:'center', width:220}}>
                        {item.item}
                    </Text>

                </View>

                <View style = {{width:window.width,backgroundColor:'grey',height:1}}>

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
                <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                    <View style = {{flexDirection:'row',width:window.width,justifyContent:'space-between',marginTop:30}}>

                        <Text style = {{fontSize: 34,color:'black',fontWeight: 'bold',margin:10, width:180}}>
                            Discover
                        </Text>


                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Search')}>
                            <View style = {{flexDirection:'row',marginRight:10,marginTop:12}}>
                                <Image style = {{width :30 ,height : 30 ,marginRight: 10,resizeMode: 'contain'}}
                                       source={require('./search.png')}/>


                            </View>
                        </TouchableOpacity>

                    </View>


                    <FlatList style= {{marginTop:0, marginBottom: 10}}
                              data={this.state.author}
                              horizontal


                              showsHorizontalScrollIndicator={false}
                              keyExtractor = { (item, index) => index.toString() }
                              extraData={this.state}
                              renderItem={this._renderItemCategs}
                    />


                    <View style = {{width:window.width,height:'auto'}}>
                        <Text style = {{marginLeft:10,fontSize: 22,marginBottom:1,fontWeight:'bold',color:'black'}}>
                            Tag List
                        </Text>
                        <FlatList style= {{marginTop:7, marginBottom: 10}}
                                  data={this.state.tag}


                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCateg}
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