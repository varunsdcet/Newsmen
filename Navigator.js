import { createStackNavigator ,createAppContainer ,createDrawerNavigator,createBottomTabNavigator,createMaterialTopTabNavigator} from 'react-navigation';

import Splash from './Splash.js';
import VideoList from './VideoList.js';
import InViewport from './InViewport.js';
import Login from './Login.js';
import Signup from './Signup.js';
import AnotherNews from './AnotherNews.js';
import Chat from './Chat.js';
import Chats from './Chats.js';
import Home from  './Home.js';
const window = Dimensions.get('window');
import Bookmark from  './Bookmark.js';
import Videos from './Videos.js';
import Discover from './Discover.js';
import Seen from './Seen.js';
import Otp from './Otp.js';
import DiscoverDetail from './DiscoverDetail.js';
import Profile from './Profile.js';
import AnotherProfile from './AnotherProfile.js';
import Drawer from './Drawer.js';
import AnotherHistory from './AnotherHistory.js';
import CreateGroup from './CreateGroup.js';
import AddMember from './AddMember.js';
import MemberList from './MemberList.js';
import About from './About.js';
import Search from './Search.js';
import GroupList from './GroupList.js';
import Password from './Password.js';
import MyVideo from './MyVideo.js';
import Forgot from './Forgot.js';
import Setting from './Setting.js';
import NewsDetail from './NewsDetail.js';
import ApniChat from './ApniChat.js';
import Recent from './Recent.js';
import ChatGroup from './ChatGroup.js';
import Wallet from './Wallet.js';
import MyChatGroup from './MyChatGroup.js';
import EditProfile from './EditProfile.js';
import Topic from './Topic.js';
import SingleChat from './SingleChat.js';
import GroupAddMember from './GroupAddMember.js';
import MyComment from './MyComment.js';
import SearchMember from './SearchMember.js';
import History from './History.js';
import SingleGroupChat from './SingleGroupChat.js';
import EditGroup from './EditGroup.js';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {Platform, StyleSheet, Text, View, Button, Image, Alert, Dimensions} from 'react-native';


const rightDrawerNavigator = createDrawerNavigator({
        Home:{
            screen: Home ,
        }

    },


    {
        initialRouteName: 'Home',
        contentComponent: Drawer,
        drawerPosition: 'left',
        drawerWidth: 300
    });


const DrawerNavigator = createDrawerNavigator({
        Home:{
            screen: rightDrawerNavigator ,
        }

    },


    {
        initialRouteName: 'Home',
        contentComponent: ApniChat,
        drawerPosition: 'right',
        drawerWidth: window.width,
    });




const TabNavigators = createBottomTabNavigator({
        DrawerNavigator: { screen: DrawerNavigator,
            navigationOptions :({ navigation }) =>( {
                title:'Home',

                tabBarLabel: 'Home',

                swipeEnabled: false,
                gesturesEnabled: false,
                // Note: By default the icon is only shown on iOS. Search the showIcon option below.
                tabBarIcon: ({ focused }) =>{
                    const image = focused
                        ? require('./homes.png')
                        : require('./home.png')
                    return (
                        <Image
                            source={image}
                            style={{height:20, width:20}}
                        />
                    )
                }
                ,
                tabBarOnPress: (scene, jumpToIndex) => {
//                      alert('home')

                    navigation.navigate('Home',{state:0})
                },
            })
        },

        SearchMember: { screen: SearchMember ,
            navigationOptions : {
                title:'Search User',
                tabBarLabel: 'Search User',
                // Note: By default the icon is only shown on iOS. Search the showIcon option below.
                tabBarIcon: ({ focused }) =>{
                    const image = focused
                        ? require('./searchss.png')
                        : require('./search.png')
                    return(
                        <Image
                            source={image}
                            style={{height:20, width:20}}
                        />

                    )
                }

            }
        },


        Videos: { screen: Videos ,
            navigationOptions : {
                title:'Video',
                tabBarLabel: 'Video',
                // Note: By default the icon is only shown on iOS. Search the showIcon option below.
                tabBarIcon: ({ focused }) =>{
                    const image =focused
                        ? require('./vids.png')
                        : require('./vid.png')
                    return(
                        <Image
                            source={image}
                            style={{width:20, height:20}}
                        />

                    )
                }

            }
        },

        Discover: { screen: Discover ,
            navigationOptions : {
                title:'Discover',
                tabBarLabel: 'Discover',
                // Note: By default the icon is only shown on iOS. Search the showIcon option below.
                tabBarIcon: ({ focused }) =>{
                    const images= focused
                        ? require('./discs.png')
                        : require('./disc.png')
                    return(
                        <Image
                            source={images}
                            style={{width:20, height:20}}
                        />

                    )
                }

            }},



        Profile :{screen:Profile,
            navigationOptions : {
                title:'Profile',
                tabBarLabel: 'Profile',
                // Note: By default the icon is only shown on iOS. Search the showIcon option below.
                tabBarIcon: ({ focused }) =>{
                    const image = focused
                        ? require('./profiles.png')
                        : require('./profil.png')
                    return(
                        <Image
                            source={image}
                            style={{width:20, height:20}}
                        />
                    )
                }
            }
        },
    },


    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabsStyle: {
                tabBarBackgroundColor: '#ff0012',
                tabBarButtonColor: '#ff0012',
                tabBarSelectedButtonColor: '#ff0012',
            },
            swipeEnabled: false,
            gesturesEnabled: false,

            tabBarIcon: () => (
                <Image
                    source={require('./profile.png')}
                    style={{width:20, height:20}}
                />
            )
        }),
        tabBarOptions: {
            swipeEnabled: false,
            gesturesEnabled: false,
            activeTintColor: '#ff0012',
            inactiveTintColor: 'black',

            showIcon:'true',

        },

    }
);




const StackNavigator = createStackNavigator({

    Splash: {screen: Splash},
    TabNavigators: {screen: TabNavigators},
    DrawerNavigator :{screen:DrawerNavigator},
    About: {screen: About},
    NewsDetail:{screen:NewsDetail},
    MemberList: {screen: MemberList},
    MyVideo: {screen: MyVideo},
    Forgot :{screen:Forgot},
    AddMember: {screen: AddMember},
    CreateGroup: {screen: CreateGroup},
    Profile: {screen: Profile},
    DiscoverDetail: {screen: DiscoverDetail},
    Discover: {screen: Discover},
    Videos: {screen: Videos},
    Home: {screen: Home},
    GroupList: {screen: GroupList},
    Bookmark: {screen: Bookmark},
    Otp: {screen: Otp},
    Chat: {screen: Chat},
    Setting:{screen:Setting},
    Password:{screen:Password},
    Login: {screen: Login},
    Chats:{screen:Chats},
    Signup: {screen: Signup},
    Recent: {screen: Recent},
    ChatGroup: {screen: ChatGroup},
    Topic: {screen: Topic},
    GroupAddMember: {screen: GroupAddMember},
    VideoList: {screen: VideoList},
    EditProfile: {screen: EditProfile},
    Seen:{screen:Seen},
    Wallet: {screen: Wallet},
    Search: {screen: Search},
    SingleChat: {screen: SingleChat},
    MyComment: {screen: MyComment},
    History: {screen: History},
    SingleGroupChat: {screen: SingleGroupChat},
    MyChatGroup: {screen: MyChatGroup},
    AnotherProfile: {screen: AnotherProfile},
    AnotherHistory: {screen: AnotherHistory},
    ApniChat: {screen: ApniChat},
    AnotherNews: {screen: AnotherNews},
    EditGroup: {screen: EditGroup},
},{
    headerMode :'none',
    mode: 'card',
    navigationOptions: params => ({
        gesturesEnabled: false,


        gesturesDirection: 'inverted',
    }),
    transitionConfig: () => ({
        screenInterpolator: sceneProps => {
            const {layout, position, scene} = sceneProps;
            const {index} = scene;

            const width = layout.initWidth;
            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [width, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return {opacity, transform: [{translateX: translateX}]};
        },
        headerTitleInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;

            return {
                opacity: position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [ 0, 1, 0],
                }),
                transform: [{
                    translateX: position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [-50, 0, 50],
                    }),
                }]
            };
        },
    }),


});

export default createAppContainer(StackNavigator);