/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React ,{ useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import PushNotification from "react-native-push-notification";
import FormRegist from "./FormRegist";

const App  = () => {
    const _channelId = "test_channel" ;
    const _channelname = "test channel" ;

    const createChannel = () => {
        PushNotification.createChannel({
            channelId : "test_channel",
            channelNamea: "test channel" 
        });
        console.log("init");
    }

    const HandleNotification = () => {
        PushNotification.localNotification({
            channelId: "test_channel",
            title : "foon & foon",
            message : "foon & foon"
        });
    }

    useEffect( ()=> {
        createChannel();
    },[]);

    return(
        <SafeAreaView>
        <View style={styles.sectionContainer}>
        <Text>App แจ้งเตือนส่งงาน</Text>
          <Text>{"\n"}</Text>
        <FormRegist />
        </View>
        
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
