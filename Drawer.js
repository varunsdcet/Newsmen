import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    View,ScrollView,
    Image,
    Alert,
    AsyncStorage,
    Dimensions,Linking,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    FlatList}
    from 'react-native';
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import DeviceInfo from 'react-native-device-info';
import Button from 'react-native-button';
import { NavigationActions,StackActions,DrawerActions } from 'react-navigation';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Drawer extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        newsHeading :["Recently Viewed","About Us",'Privacy Policy','Terms of Use','Logout'],
        newsHeadingGuest:["About Us",'Privacy Policy','Terms of Use'],
        loading:'',
        states:'',
        results: [],
        news:[],
        device :'',
        build :'',

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
    _YesLogout=()=>{

        const url = GLOBAL.BASE_URL +  'logout'
//      this.showLoading()
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

//    alert(JSON.stringify(responseJson))
                //     this.hideLoading()
                if (responseJson.status == true) {
                    GLOBAL.user_id='';
                    AsyncStorage.removeItem('userID');

                    this.props
                        .navigation
                        .dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: 'Login',
                                    params: { someParams: 'parameters goes here...' },
                                }),
                            ],
                        }))


                    this.props.navigation.dispatch(DrawerActions.closeDrawer())

                }else {
                    alert('Something Went Wrong.')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    navigateToScreen1 = (route) => {

        Alert.alert('Logout!','Are you sure you want to Logout?',
            [{text:"Cancel"},
                {text:"Yes", onPress:()=>this._YesLogout()
                },
            ],
            {cancelable:false}
        )

    }








    getNewsUpdate(){
        //    alert(GLOBAL.user_id)
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
//              alert(JSON.stringify(responseJson))

                if(responseJson.status ==true){
                    this.setState({news:responseJson.m_list})

                }
                else{
                    this.setState({news:[]})
                }
//                  this.arrayholder =  responseJson.m_list



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

    _handleStateChange = state => {
        this.getNewsUpdate()

    };

    componentWillMount() {

        // if(GLOBAL.user_id== ''){
        //   this.setState({newsHeadingGuest :["About Us",'Privacy Policy','Terms of Use']})
        //
        // }else{
        //   this.setState({newsHeading :["My Bookmarks","About Us",'Privacy Policy','Terms of Use','Logout']})
        // }

        this.props.navigation.addListener('willFocus',this._handleStateChange);

        this.setState({device:DeviceInfo.getVersion()})
        this.setState({build:DeviceInfo.getBuildNumber()})

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
    _handleCategorySelect=(item,index)=>{

        // GLOBAL.groupName = item.g_name
        // GLOBAL.groupId =  item.group_id
        GLOBAL.groupName = item.g_name
        GLOBAL.groupId =  item.group_id
        GLOBAL.muid = 'g'+item.group_id
        GLOBAL.newsWhich = "2";
        GLOBAL.anotherUsername = item.g_name
        GLOBAL.guid ="1";

        this.props.navigation.navigate('Chat')

//        alert(item.group_id)
        // GLOBAL.array =   [...GLOBAL.array,  item]
//        this.props.navigation.navigate('ChatGroup')
    }

    // componentDidMount(){
    // }
    _resPress = (index) =>{
        if (index == 1){
            this.props.navigation.navigate('About')
        }else if (index== 2){
            var li = 'http://www.thenewsmen.co.in/privacy.php'
            Linking.canOpenURL(li).then(supported => {
                supported && Linking.openURL(li);
            }, (err) => console.log(err));

        }
        else if (index == 3){
            var lin = 'http://www.thenewsmen.co.in/t_c.php'
            Linking.canOpenURL(lin).then(supported => {
                supported && Linking.openURL(lin);
            }, (err) => console.log(err));

        }

        else if (index== 4){
//            alert('dsfsdf')
            this.navigateToScreen1('Login')
        }
        else if (index== 0){
//            alert('dsfsdf')
            this.props.navigation.navigate('Bookmark')
        }
    }



    _renderItemCateg = (item,index)=>{


        return (

            <TouchableOpacity
                onPress={() => this._handleCategorySelect(item.item,index)}>

                <View style = {{margin :5 ,backgroundColor:'transparent',width:'100%',
                    justifyContent:'space-between',flexDirection:'row'}}>







                    <Text style = {{fontSize:18,fontWeight:'bold',marginLeft:7, width:'80%'}}>
                        {item.item.g_name}
                    </Text>


                    <Image style = {{width :20 ,height : 20,resizeMode:'contain',marginRight:20,marginTop:4,alignSelf: 'flex-end'}}
                           source={require('./settingarrow.png')}/>


                </View>


                <View style = {{backgroundColor:'grey',height:1,marginBottom:10}}>
                </View>


            </TouchableOpacity>


        )
    }

    _resPressGuest = (index) =>{
        if (index == 1){
            var li = 'http://139.59.76.223/thenewsmen/privacy.php'
            Linking.canOpenURL(li).then(supported => {
                supported && Linking.openURL(li);
            }, (err) => console.log(err));

        }else if (index== 2){
            var lin = 'http://139.59.76.223/thenewsmen/t_c.php'
            Linking.canOpenURL(lin).then(supported => {
                supported && Linking.openURL(lin);
            }, (err) => console.log(err));

        }

        else if (index== 0){

            this.props.navigation.navigate('About')
        }
    }


    _renderItemCategsGuest = (item,index)=>{
        return (
            <TouchableOpacity
                onPress={() => this._resPressGuest(item.index)}>
                <View style = {{margin :5 ,backgroundColor:'white',width:'100%',
                    justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style = {{fontSize:18,fontWeight:'bold',marginLeft:7, width:'80%'}}>
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

    _renderItemCategs = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this._resPress(item.index)}>


                <View style = {{margin :5 ,backgroundColor:'white',width:'100%',
                    justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style = {{fontSize:18,fontWeight:'bold',marginLeft:7, width:'80%'}}>
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
        var le = this.state.news.length
        var commonHtml = `Version : ${this.state.device} (${this.state.build})`;
        return (
            <View style={styles.container}>

                <Image style = {{width :'100%',height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:'100%',flex:1}}>
                    <ScrollView>

                        <Image style = {{width :200,height : 100,marginTop:30,alignSelf:'center',resizeMode:'contain'}}
                               source={require('./logo.png')}/>

                        {/*                        <Text style = {{fontSize:14,fontWeight:'bold',marginLeft:7,marginTop:20,textDecorationLine:'underline'}}>
                            MY GROUPS
                        </Text>


{le == 0 &&(

  <Text style = {{fontSize:14,marginLeft:20,marginBottom:20,marginTop:20,width:'80%'}}>
  No Group Found
  </Text>


)}

{le !=0 &&(
  <FlatList style= {{marginTop:10,backgroundColor:'transparent'}}
            data={this.state.news}


            showsHorizontalScrollIndicator={false}
            keyExtractor = { (item, index) => index.toString() }
            extraData={this.state}
            renderItem={this._renderItemCateg}
  />


)}

*/}
                        {GLOBAL.user_id == '' &&(
                            <FlatList style= {{marginTop:20, marginBottom: 10,backgroundColor:'transparent'}}
                                      data={this.state.newsHeadingGuest}


                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this._renderItemCategsGuest}
                            />

                        )}
                        {GLOBAL.user_id!='' &&(
                            <FlatList style= {{marginTop:20, marginBottom: 10,backgroundColor:'transparent'}}
                                      data={this.state.newsHeading}


                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this._renderItemCategs}
                            />


                        )}


                        <Text style = {{fontSize:14,marginTop:2,textAlign: 'center'}}>
                            {commonHtml}
                        </Text>


                        <Text style = {{fontSize:14,marginTop:7,textAlign: 'center', marginBottom:10}}>
                            © TheNewsmen
                        </Text>


                    </ScrollView>

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
        left: '100%',

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

        width: '100%',
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