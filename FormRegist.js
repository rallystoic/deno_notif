import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import SQLite  from 'react-native-sqlite-storage';
import GetData from "./getData";

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


export default function FormRegist() {
      const [date_, setDate_] = useState(new Date())

      const [mode, setMode] = useState('date');

      const { control, handleSubmit, formState: { errors } } = useForm();
    const [show, setShow] = useState(false);

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"subject "
                +"(id INTEGER PRIMARY KEY AUTOINCREMENT, name  TEXT, description   TEXT, date_created  TEXT, date_delivery TEXT, is_send  INTEGER);"
            );
        })
    };

    const InsertData = () => {
        db.transaction( (tx) => {
            tx.executeSql(
                "INSERT INTO subject (name,date_delivery) values('math', '2021/08/15 18:00:00')"
            );
        });
    }

    useEffect( () => {
        createTable();
        //InsertData();
    },[]);

      const onSubmit = data => { console.log(data)
          var lll = moment(date_);
          // time format to be registered
          //console.log(lll.format("YYYY-MM-DD HH:mm"));
          let result = lll.format("YYYY/MM/DD HH:mm:ss");
          console.warn(result);
          let  test_ = new Date(result);
          console.log(test_.toString());
      };

      const onchange = (event, selectedDate) => {
              const currentDate = selectedDate || date_;
              setShow(Platform.OS === 'ios');
              setDate_(currentDate);
            };

      const showMode = (currentMode) => {
              setShow(true);
              setMode(currentMode);
            };

      const showDatepicker = () => {
              showMode('date');
            };

      const showTimepicker = () => {
              showMode('time');
            };

    const styles = StyleSheet.create({
        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        },
        textlong : {
            padding: 10,
            margin: 12,
            borderWidth: 1,
        }
    });

      return (
              <View>
          <Text>วิชา</Text>
                <Controller
                  control={control}
                  rules={{
                               required: true,
                                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                  style={styles.input}
                                  onBlur={onBlur}
                                  onChangeText={onChange}
                                  value={value}
                                />
                              )}
                  name="subject"
                  defaultValue=""
                />
                {errors.subject && <Text>This is required.</Text>}


          <Text>รายละเอียด</Text>
                <Controller
                  control={control}
                  rules={{
                      maxLength: 255,
                                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                      multiline
                      numberOfLines={4}
                                  style={styles.textlong}
                                  onBlur={onBlur}
                                  onChangeText={onChange}
                                  value={value}
                                />
                              )}
                  name="description"
                  defaultValue=""
                />
          <View>
          <Text>วันและเวลากำหนดส่ง</Text>
                  <Button style={styles.button} onPress={showDatepicker} title="date picker!" />
                </View>
                <View>
                  <Button onPress={showTimepicker} title="time picker!" />
                </View>

          <Text>{"\n"}</Text>

                <Button title="บันทึก" onPress={handleSubmit(onSubmit)} />

                {show && (
                            <DateTimePicker
                              testID="dateTimePicker"
                              value={date_}
                              mode={mode}
                              is24Hour={true}
                              display="default"
                              onChange={onchange}
                            />
                          )}
          <Text>{"\n"}</Text>

          <GetData />
              </View>
            );
}
