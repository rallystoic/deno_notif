
import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Button, Alert, StyleSheet, SafeAreaView,ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import PushNotification from "react-native-push-notification";
import SQLite  from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name: 'subject',
        location: "default"
    },
    () => {
        console.log("database success!");
    },
    error => {
        console.log(error);
    }

);

export const testTime = () => {
    // const date1 = new Date('12/15/2021 20:22:00');
    // const date1 = new Date('12/15/2021 20:22:00');
    let currentdate = "2021/08/17 20:20:00";
    let date_delivery = "2021/08/16 20:22:00";
    const date1 = new Date(currentdate);
    const date2 = new Date('2021/08/17 20:21:00');
    const dateUnix1 = new Date('12/15/2021 20:20:00').getTime() / 1000;
    const dateUnix2 = new Date('12/15/2021 20:21:00').getTime() / 1000;

          let lll = moment(new Date());

    let currentdate__  = lll.format("YYYY/MM/DD HH:mm:ss");
    console.log(currentdate__, "currentdate__");
    

            
    console.log(dateUnix1, ": 1");
    console.log(dateUnix2, ": 2 ");
    if (dateUnix2 > dateUnix1) {
        console.log("aborted ");
    }
    console.log(getDifferenceInDays(date1, date2), "days");
    console.log(getDifferenceInHours(date1, date2), "hours");
    console.log(getDifferenceInMinutes(date1, date2), "minutes");

}
export const IsNotifable = date_delivery => {
    let currentdate_ = moment(new Date());
    let date_delivery_ = moment(new Date(date_delivery));
    let currentdateUnix =  currentdate_.unix();
    let  date_deliveryUnix = date_delivery_.unix();

    let currentdateFormat = currentdate_.format('YYYY/MM/DD HH:mm:ss');
    let date_deliveryFormat = date_delivery_.format('YYYY/MM/DD HH:mm:ss');
    console.log(currentdateFormat);
    console.log(date_deliveryFormat);

    console.log(`${currentdateUnix} : ${date_deliveryUnix}`);
    if (currentdateUnix > date_deliveryUnix) {
        console.log('above time');
        // send false;
        return false;
    }
    let result = getDifferenceInMinutes(currentdate_ , date_delivery_);
     if ( result < 1) {
         console.log("fire!");
         // send true
         return  true;
     }

    // send false
    return false;


   }
  //  const HandleNotification = () => {
  //      PushNotification.localNotification({
  //          channelId: "test_channel",
  //          title : "foon & foon",
  //          message : "foon & foon"
  //      });
  //  }

//export const 
function getDifferenceInDays(date1, date2) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs / (1000 * 60 * 60 * 24);
}

function getDifferenceInHours(date1, date2) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs / (1000 * 60 * 60);
}

function getDifferenceInMinutes(date1, date2) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs / (1000 * 60);
}



    export const GetDataAll = () => {
        const currentdate = new Date();
        console.log(currentdate);
        const datas = [];
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT id, name, description, date_delivery from subject",
                [],
                (tx, results) => {

                    var len = results.rows.length;    
                    if (len > 0) {

                        for (var i = 0; i < len; i++) {
                            let data = {
                                id: 0,
                                name: '',
                                description: '',
                                date_delivery: '',
                            }
                           // data.id  = results.rows.item(i).id;
                           // data.name  = results.rows.item(i).name;
                           // data.description  = results.rows.item(i).description;
                            //data.date_delivery  = results.rows.item(i).date_delivery;
                            console.log(results.rows.item(i).date_delivery);
                            if (IsNotifable(results.rows.item(i).date_delivery) === true) {
                                PushNotification.localNotification({
                                    channelId: "test_channel",
                                    title : results.rows.item(i).name, 
                                    message : `${results.rows.item(i).description} กำหนดส่งเวลา ${results.rows.item(i).date_delivery}`
                                });
                                
                            }

                        }

                    }
                }
            );
        })
    }


