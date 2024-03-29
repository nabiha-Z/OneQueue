import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Picker } from 'react-native';
import { Entypo, MaterialIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import firebase from 'firebase/app';
import storage from 'firebase/storage'
import DateTimePicker from 'react-native-modal-datetime-picker';

function NewService({ navigation }) {

    const auth = firebase.auth();
    const db = firebase.firestore();
    const [time2, setTime2] = useState("20:00");
    const [getName, setName] = useState(null);
    const [getDetail, setDetail] = useState(null);
    const [getPrice, setPrice] = useState(null);
    const [error, setError] = useState("");
    const [time1, setTime1] = useState("9:00");
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState(["Beauty & Wellness", "Medical", "Sports", "Freelancer", "Events", "Entertainment", "Official", "Education"])

    const [selectedValue, setSelectedValue] = useState(categories[0]);

    const uploadImage = async (uri) => {

        console.log("selected value:", selectedValue )
        const response = await fetch(uri);
        const blob = await response.blob();
        var imagename = getName + new Date().toString();
        var ref = firebase.storage().ref().child(imagename);
        await ref.put(blob);
        ref.getDownloadURL().then(
            (data) => {
                db.collection('services').add({
                    name: getName,
                    detail: getDetail,
                    price: getPrice,
                    time1: time1,
                    time2: time2,
                    img: data,
                    store: auth.currentUser.uid,
                    category:selectedValue
                }).then(
                    data => {

                        Alert.alert('Service Added Successfully');
                        navigation.navigate('Profile');
                    }
                )
            }
        )



    };
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const handlePicker1 = (dateTime) => {
        var selectedTime = moment(dateTime).format('HH:mm');
        setTime1(selectedTime);
        setShow1(false);
    }

    const handlePicker2 = (dateTime) => {
        var selectedTime = moment(dateTime).format('HH:mm');
        setTime2(selectedTime);
        setShow2(false);
    }

    const hidePicker = () => {
        setShow1(false);
        setShow2(false);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            // base64: true,
            aspect: [4, 3]
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };



    return (
        <View style={styles.container}>
            <Text
                style={styles.heading}>
                Add a new Service
            </Text>
            <Text
                style={styles.desc}>
                This will add a new service of your business
            </Text>

            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.inputField}
                placeholder='Enter Service Name'
                value={getName}
                onChangeText={text => setName(text)}
            />

            <Text style={styles.label}>Detail:</Text>
            <TextInput
                style={styles.inputField}
                placeholder='Detail'
                value={getDetail}
                onChangeText={text => setDetail(text)}
            />
            <Text style={styles.label}>Price:</Text>
            <TextInput
                keyboardType='numeric'
                style={styles.inputField}
                placeholder='Price $'
                value={getPrice}
                onChangeText={text => setPrice(text)}
            />

            <Text style={styles.label}>Select Category</Text>
            {/* <SelectDropdown
                    data={service}
                    onSelect={(selectedItem, index) => {
                        setSelected(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {

                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                    defaultButtonText="Click for options"
                    buttonStyle={selectedService != null ? [styles.button, { backgroundColor: 'white' }] : styles.button}
                    dropdownStyle={styles.dropdown}
                    rowTextStyle={styles.dropdownItems}
                    buttonTextStyle={selectedService != null ? [styles.buttonText, { color: '#12555C' }] : styles.buttonText}
                /> */}
            <Picker
                selectedValue={selectedValue}
                style={{ height: 50, width: 250}}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              
                {categories.map((item, key) => (
                    
                    <Picker.Item label={item} value={item} key={key}/>
                ))}
                
            </Picker>

            <Text style={styles.label}>Select your timings</Text>

            <View style={styles.timePickerView}>

                <TouchableOpacity
                    style={styles.timePicker}
                    onPress={() => setShow1(true)}
                >
                    <Text>{time1}</Text>
                </TouchableOpacity>
                <Text> --</Text>
                <TouchableOpacity
                    style={styles.timePicker}
                    onPress={() => setShow2(true)}
                >
                    <Text>{time2}</Text>
                </TouchableOpacity>

            </View>
            <DateTimePicker
                isVisible={show1}
                testID="dateTimePicker1"
                value={time1}
                mode="time"
                is24Hour={true}
                display="default"
                onConfirm={(e) => handlePicker1(e)}
                onCancel={hidePicker}
            />

            <DateTimePicker
                isVisible={show2}
                testID="dateTimePicker2"
                value={time2}
                mode="time"
                is24Hour={true}
                display="default"
                onConfirm={(e) => handlePicker2(e)}
                onCancel={hidePicker}
            />


            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.imageBtn} onPress={pickImage} >
                    <Entypo name="arrow-up" size={15} color="white" style={{}} />
                    <Text style={{ color: 'white', textAlign: 'center', margin: 0 }}>Choose Image</Text>
                </TouchableOpacity>

                {image && (
                    <TouchableOpacity style={styles.selectedImgBtn} onPress={() => setImage(null)}>
                        <Image source={{ uri: image }} style={styles.selectedImage} />
                    </TouchableOpacity>)}

            </View>

            <TouchableOpacity
                onPress={() => uploadImage(image)}
                style={styles.addButton}
            >
                <Text style={{ color: '#D7D9D9' }}>Add</Text>
            </TouchableOpacity>


        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,

    },
    heading: {
        fontSize: 25,
        marginTop: 5,
        fontWeight: 'bold',
        color: '#5B5A59'
    },
    desc: {
        fontSize: 13,
        opacity: 0.7,
        marginTop: 5,
    },

    label: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10
    },
    inputField: {
        borderBottomWidth: 2,
        width: '70%',
        marginTop: 4,
        marginBottom: 15,
        padding: 5,
        borderColor: '#95BFBA',

    },
    addButton: {
        backgroundColor: '#22524C',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        marginTop: 40,
        borderRadius: 15,

    },
    timePickerView: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        alignContent: 'center',
        width: '100%',
        marginTop: 10
    },
    timePicker: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#DFDEDD',
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
        textAlign: 'center',
        marginLeft: 10
    },
    timePickerText: {
        fontSize: 13,
        color: '#8E8E8E',
        textAlign: 'center'
    },

    imageBtn: {
        flexDirection: 'row',
        backgroundColor: '#687EA3',
        padding: 10,
        borderRadius: 20,
        paddingLeft: 15,
        marginTop: 20,
        width: '45%',
        alignItems: 'center',
        textAlign: 'center',
        elevation: 20,
        shadowColor: '#0B1A34',
    },
    selectedImgBtn: {
        backgroundColor: '#E1E7F1',
        width: 40,
        height: 40,
        zIndex: 2,
        padding: 10,
        borderRadius: 40 / 2,
        marginTop: 20,
        marginLeft: 10
    },
    selectedImage: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        position: 'absolute',
        alignSelf: 'center',
        top: 5

    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#253530',
        height: 35,
        width: '65%',
        paddingHorizontal: 10,
        zIndex: 1,
        borderRadius: 5,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#253530',

    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15
    },
    dropdown: {
        backgroundColor: '#F4F6F7',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        width: 300,
        borderRadius: 10,
        height: 300
    },
    dropdownItems: {
        textAlign: 'center',
        color: '#414244'
    },
});

export default NewService;
