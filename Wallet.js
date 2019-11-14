import React from 'react';
import {Dimensions, ImageBackground, Text, Image, View, TouchableOpacity,} from 'react-native';
import * as Animatable from 'react-native-animatable';
import erlich from './background.png';
import moneyFront from './money-front.png';
import moneyBack from './money-back.png';
import Button from "react-native-button";
const GLOBAL = require('./Global');

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
const window = Dimensions.get('window');


const MONEY_DIMENSIONS = { width: 49, height: 26 };
const SCREEN_DIMENSIONS = Dimensions.get('window');
const WIGGLE_ROOM = 50;

const FlippingImage = ({ back = false, delay, duration = 1000, source, style = {} }) => (
    <Animatable.Image
        animation={{
            from: { rotateX: back ? '0deg' : '180deg', rotate: !back ? '180deg' : '0deg' },
            to: { rotateX: back ? '360deg' : '-180deg', rotate: !back ? '180deg' : '0deg' },
        }}
        duration={duration}
        delay={delay}
        easing="linear"
        iterationCount="infinite"
        useNativeDriver
        source={source}
        style={{
            ...style,
            backfaceVisibility: 'hidden',
        }}
    />
);

const Swinging = ({ amplitude, rotation = 7, delay, duration = 700, children }) => (
    <Animatable.View
        animation={{
            0: {
                translateX: -amplitude,
                translateY: -amplitude * 0.8,
                rotate: `${rotation}deg`,
            },
            0.5: {
                translateX: 0,
                translateY: 0,
                rotate: '0deg',
            },
            1: {
                translateX: amplitude,
                translateY: -amplitude * 0.8,
                rotate: `${-rotation}deg`,
            },
        }}
        delay={delay}
        duration={duration}
        direction="alternate"
        easing="ease-in-out"
        iterationCount="infinite"
        useNativeDriver
    >
        {children}
    </Animatable.View>
);

const Falling = ({ duration, delay, style, children }) => (
    <Animatable.View
        animation={{
            from: { translateY: -MONEY_DIMENSIONS.height - WIGGLE_ROOM },
            to: { translateY: SCREEN_DIMENSIONS.height + WIGGLE_ROOM },
        }}
        duration={duration}
        delay={delay}
        easing={t => Math.pow(t, 1.7)}
        iterationCount="infinite"
        useNativeDriver
        style={style}
    >
        {children}
    </Animatable.View>
);


const randomize = max => Math.random() * max;

const range = count => {
    const array = [];
    for (let i = 0; i < count; i++) {
        array.push(i);
    }
    return array;
};

export default class Wallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yeah:''
        };
    }

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

    render(){

        const ErlichBachman = ({ children }) => (

            <ImageBackground source={erlich} style={{ flex: 1 }}>
                <View style = {{flexDirection:'row',width:window.width,marginTop:62}}>
                    <TouchableOpacity style = {{width :30 ,height : 30 }}
                                      onPress={() => this.props.navigation.goBack()}>
                        <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                               source={require('./arrow.png')}/>
                    </TouchableOpacity>
                </View>

                {children}

                <View style={{position:'absolute', top:window.height/4, width:window.width ,alignItems:'center'}}>
                    <Image style={{width:120, height:120, resizeMode:'contain'}} source={require('./wallet.png')}/>
                    <Text style={{color:'#c13e44', fontWeight:'bold', fontSize:22,alignSelf:'center',marginTop:12}}>You Wallet Balance is Rs : {GLOBAL.wallets}</Text>

                    <Button
                        style={{ fontSize: 20, color: 'white' }}
                        containerStyle={{ marginTop:80,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44',margin:15}}
                        onPress={()=> this.props.navigation.navigate('Profile')}

                    >
                        REDEEM
                    </Button>
                </View>
            </ImageBackground>
        );

        var count = 15, duration = 3000


        return(

            <ErlichBachman>
                {range(count)
                    .map(i => randomize(1000))
                    .map((flipDelay, i) => (
                        <Falling
                            key={i}
                            duration={duration}
                            delay={i * (duration / count)}
                            style={{
                                position: 'absolute',
                                paddingHorizontal: WIGGLE_ROOM,
                                left: randomize(SCREEN_DIMENSIONS.width - MONEY_DIMENSIONS.width) - WIGGLE_ROOM,
                            }}
                        >
                            <Text style={{color:'black', fontWeight:'bold'}}>  You won {GLOBAL.wallets}</Text>
                            <Swinging amplitude={MONEY_DIMENSIONS.width / 5} delay={randomize(duration)}>
                                <FlippingImage source={moneyFront} delay={flipDelay} />
                                <FlippingImage
                                    source={moneyBack}
                                    delay={flipDelay}
                                    back
                                    style={{ position: 'absolute' }}
                                />
                            </Swinging>
                        </Falling>
                    ))}
            </ErlichBachman>
        )
    }



}


