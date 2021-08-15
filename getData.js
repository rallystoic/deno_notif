
import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Button, Alert, StyleSheet, SafeAreaView,ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
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
    export const triggersome = () => {
        this.GetDatas();
    }


export default function GetData() {
    
      const [DbData, setDbData] = useState([]);
        let _datas = [];

                //+"(id INTEGER PRIMARY KEY AUTOINCREMENT, name  TEXT, description   TEXT, date_created  TEXT, date_delivery TEXT, is_send  INTEGER);"

    useEffect( () => {
        setTimeout(GetDatas, 1000);
        //GetDatas();
        
    }, []);

    const DeleteSubject = id => {
console.log(id);
        db.transaction( (tx) => {
        tx.executeSql(
            `DELETE FROM subject WHERE id = ${id}`
        );
        }, () => {
            //console.log("____deleted");
        },error => {
            console.log(error);
        });
        GetDatas();
    }

    const styles = StyleSheet.create({
        fixToText: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        }
    });

const ServiceComponent = () => {
        const list = DbData.map((item, index) => {
            return (
                <View key={index.toString()} style={{ borderWidth: 1 }}>
                    <Text> วิชา: {item.name}</Text>
                    <Text> รานละเอียด: {item.description}</Text>
                    <Text> กำหนดส่ง: {item.date_delivery}</Text>
                <Button title="ลบ" color="#FF0000" onPress={() => DeleteSubject(item.id)} />
                </View>
            );
        });

        return list;
    }

    const GetDatas = () => {
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
                            data.id  = results.rows.item(i).id;
                            data.name  = results.rows.item(i).name;
                            data.description  = results.rows.item(i).description;
                            data.date_delivery  = results.rows.item(i).date_delivery;
                            _datas.push(data);
                        }
                        setDbData(_datas);
                        //console.log(_datas);
                    }
                }
            );
        })
    };

    return(
        <View>
        <Text> รายงาน แจ้งเตือนการส่งงาน</Text>
        <SafeAreaView>
        <ScrollView>
        <ServiceComponent />
        </ScrollView>
        </SafeAreaView>
        </View>
    );

}
