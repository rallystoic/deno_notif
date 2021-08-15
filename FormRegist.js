import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Button, Alert, StyleSheet,SafeAreaView, ScrollView } from "react-native";
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


export default function FormRegist() {
      const [date_, setDate_] = useState(new Date())

      const [mode, setMode] = useState('date');
      const [DbData, setDbData] = useState([]);
        let _datas = [];

      const { control, handleSubmit, formState: { errors } } = useForm();
    const [show, setShow] = useState(false);
    useEffect( () => {
        createTable();
        setTimeout(GetDatas, 1000);
        //InsertData();
    },[]);

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"subject "
                +"(id INTEGER PRIMARY KEY AUTOINCREMENT, name  TEXT, description   TEXT, date_created  TEXT, date_delivery TEXT, is_send  INTEGER);"
            );
        })
    };
    const DeleteSubject = id => {
console.log(id);
        setDbData([]);
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

    const InsertData = (_prop) => {
        db.transaction( (tx) => {
            tx.executeSql(
                `INSERT INTO subject (name, description, date_delivery) values('${_prop.name}', '${_prop.description}', '${_prop.date_delivery}')`
            );
        },() => {
            console.log("success");
        },error => {
            console.log(error);
        });
    }


      const onSubmit = data => { console.log(data)
          let lll = moment(date_);
          // time format to be registered
          //console.log(lll.format("YYYY-MM-DD HH:mm"));
          let result = lll.format("YYYY/MM/DD HH:mm:ss");
          console.log(result);
          let _dataprop = {
              name : data.name,
              description : data.description,
              date_delivery : result
          };
          InsertData(_dataprop);
         // console.log(_dataprop);
         // //console.warn(result);
         // let  test_ = new Date(result);
         // console.log(test_.toString());
          GetDatas();
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
                      maxLength: 50
                                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                  style={styles.input}
                                  onBlur={onBlur}
                                  onChangeText={onChange}
                                  value={value}
                                />
                              )}
                  name="name"
                  defaultValue=""
                />
                {errors.name && <Text>This is required.</Text>}


          <Text>รายละเอียด</Text>
                <Controller
                  control={control}
                  rules={{
                               required: true,
                      maxLength: 255
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
                {errors.name && <Text>This is required.</Text>}
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

        <Text> รายงาน แจ้งเตือนการส่งงาน</Text>
        <SafeAreaView>
        <ScrollView>
        <ServiceComponent />
        </ScrollView>
        </SafeAreaView>

              </View>
            );
}
