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
    SafeAreaView,
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
export default class SearchMember extends Component {
    state = {

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
        const url = GLOBAL.BASE_URL +  'list_user'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                limit_from: '0',

            }),
        }).then((response) => response.json())
            .then((responseJson) => {


                this.arrayholder =  responseJson.user_list

              //  this.setState({news:responseJson.user_list})
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
        GLOBAL.array =   [...GLOBAL.array,  item]
        this.props.navigation.goBack()
    }

    _handleCategorySelects = (item,index) => {



        GLOBAL.anotherUsername = item.user_name;
        GLOBAL.another =  item.user_id;

        GLOBAL.muid = 'u'+ GLOBAL.user_id + GLOBAL.another



        GLOBAL.newsWhich = "2";

        GLOBAL.guid="0";

        //  this.props.navigation.navigate('Chat')


        GLOBAL.another = item.user_id
        GLOBAL.anotherUsername =  item.user_name
//              alert('asd')
        this.props.navigation.navigate('AnotherProfile')


    }
    _renderItemCategs = (item,index)=>{

//      alert(JSON.stringify(item))
        return (
            <TouchableOpacity
                onPress={() => this._handleCategorySelects(item.item,index)}>


                <View style = {{ backgroundColor:'white',width:window.width,
                    flexDirection:'row',height : 50}}>




                    <Image style = {{width :30 ,height : 30 ,padding:4,borderRadius:15,marginLeft:10, marginTop:12}}
                           source={{uri: item.item.image}}/>


                    <Text style = {{fontSize:18,marginTop :16,marginLeft:10}}>
                        {item.item.user_name}
                    </Text>

                    <Text style = {{fontSize:18,marginTop :16,marginLeft:10}}>
                        ({item.item.username})
                    </Text>








                </View>

                <View style={{height:1, backgroundColor:'#efefef', width:window.width,marginTop:4}}>
                </View>


            </TouchableOpacity>


        )
    }
    SearchFilterFunction(text){
        const newData = this.arrayholder.filter(function(item){
            const itemData = item.user_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            news: newData,
            text: text,
            nodata:'No found'
        })

    }
    ok =()=> {
        this.setState({text:''})
        this.getNewsUpdate()
    }
    render() {


        return (
            <SafeAreaView>
            <View style={styles.container}>



                <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>


                    <View style = {{borderRadius:5 ,height:40,width:window.width ,marginLeft:5,marginTop:25,flexDirection:'row'}}>

                        <View style = {{flexDirection:'row', width:'68%',backgroundColor:'#efefef'}}>

                            <Image style = {{width :18 ,height : 18 ,marginLeft: 10,resizeMode: 'contain',marginTop:10}}
                                   source={require('./searchs.png')}/>

                            <TextInput
                                style={{ height: 40, borderColor: 'gray',fontSize:14, borderBottomWidth: 0, marginTop:0 ,marginBottom: 20 ,marginLeft:5,width:window.width -150,color:'black' }}
                                // Adding hint in TextInput using Placeholder option.
                                placeholder="Search User"
                                onChangeText={(text) => this.SearchFilterFunction(text)}
                                value={this.state.text}
                                // Making the Under line Transparent.
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <Button
                            style={{ fontSize: 18, color: 'black' }}
                            containerStyle={{ width:100, height: 45, overflow: 'hidden',marginTop:8,marginLeft:8}}

                            onPress={() => this.ok()}
                        >
                            Cancel
                        </Button>
                    </View>

                    <Text style = {{fontSize:18,margin:10}}>
                        SUGGESTED USERS
                    </Text>

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