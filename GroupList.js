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
const GLOBAL = require('./Global');
var arrayholder = [];
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class GroupList extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        text:'',
        news :[],
        status :'',
        ipAdd : '',
        newsHeading :['Video','HighFlyer','Movie',"Politics","Election"],
        loading:'',
        states:'',
        results: [],isadded:0

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



    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'group_list'


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


                this.arrayholder =  responseJson.m_list

                this.setState({news:responseJson.m_list})
                //
                // for (let order of responseJson.user_list) {
                //     if (food.id === order.user_id) {
                //         responseJson.user_list.splice(this.orders.indexOf(order), 1);
                //         break;
                //     }
                // }


            })
            .catch((error) => {
                console.error(error);
            });

    }
    showLoading() {
        this.setState({loading: true})
    }





    _renderItemCateg = (item,index)=>{


        return (

            <View>


                <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:100,
                    backgroundColor:'white',padding:5}}>
                    <Image style = {{width :80 ,height : 80 ,padding:12,margin:5 ,borderRadius:40 }}
                           source={require('./splash.png')}/>
                    <Text style = {{fontSize: 16,marginBottom:2,fontWeight:'bold',alignSelf:'center'}}>
                        {item.item}
                    </Text>

                </View>



            </View>

        )
    }

    componentWillMount() {
        this.getNewsUpdate()
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
        this.getNewsUpdate()
        console.log(`is connected: ${this.state.status}`);
    }



    hideLoading() {
        this.setState({loading: false})
    }

    componentDidMount(){
    }


    _handleCategorySelect=(item,index)=>{

        // GLOBAL.groupName = item.g_name
        // GLOBAL.groupId =  item.group_id


        GLOBAL.groupName = item.g_name
        GLOBAL.groupId =  item.group_id
        GLOBAL.muid = 'g'+item.group_id
        GLOBAL.newsWhich = "2";
        GLOBAL.anotherUsername = item.g_name
        GLOBAL.guid="1";

        this.props.navigation.navigate('Chat')

//        alert(item.group_id)
        // GLOBAL.array =   [...GLOBAL.array,  item]
//        this.props.navigation.navigate('ChatGroup')
    }

    _renderItemCategs = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this._handleCategorySelect(item.item,index)}>


                <View style = {{margin :10 ,backgroundColor:'white',width:window.width,
                    flexDirection:'row'}}>




                    <Image style = {{width :50 ,height : 50 ,padding:4,borderRadius:25,margin:10 }}
                           source={{uri: item.item.image}}/>

                    <View style = {{flexDirection:'column',width:window.width/2,margin:10,marginTop:15}}>
                        <Text style = {{fontSize:18}}>
                            {item.item.g_name}
                        </Text>
                        <Text style = {{fontSize:14}}>
                            {item.item.description}
                        </Text>



                    </View>




                </View>

                <View style={{height:1, backgroundColor:'#efefef', width:window.width,marginTop:-15}}>
                </View>


            </TouchableOpacity>


        )
    }
    SearchFilterFunction(text){
        const newData = this.arrayholder.filter(function(item){
            const itemData = item.g_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            news: newData,
            text: text,
            nodata:'No found'
        })

    }
    render() {
        if(this.state.loading){
            return(
                <View style={styles.container}>



                    <ActivityIndicator style = {styles.loading}
                                       size="small" color='#c13e44' />
                </View>
            )
        }


        return (
            <SafeAreaView>
            <View >



                <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                    <View style = {{height:50,flexDirection:'row',width:window.width,backgroundColor:'#efefef', flex:1}}>

                        <View style = {{marginTop:12,flexDirection:'row'}}>
                            <TouchableOpacity style = {{width :40 ,height : 40, zIndex:1 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain',marginTop:4}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>



                            <Text style = {{marginLeft:12,fontSize: 20,color:'#c53b41',fontWeight: 'bold', width:'70%',marginTop:1}}>
                                Group List
                            </Text>


                        </View>
                    </View>



                    <FlatList style= {{marginTop:10, marginBottom: 10,backgroundColor:'transparent'}}
                              data={this.state.news}


                              showsHorizontalScrollIndicator={false}
                              keyExtractor = { (item, index) => index.toString() }
                              extraData={this.state}
                              renderItem={this._renderItemCategs}
                    />





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
    }
})