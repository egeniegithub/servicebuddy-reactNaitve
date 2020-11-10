import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import CustomHeader from '../components/CustomHeader';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import * as colors from '../Themes/Color';
import { Input, Button } from 'react-native-elements';
import { getJobInvoice } from '../network/Network';
import { Dialog } from 'react-native-simple-dialogs';
import { WebView } from 'react-native-webview';

function GetPayment() {
    const [radioValue, setRadioValue] = useState(0);
    const [radioText, setRadioText] = useState('');
    const [amount, setAmount] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    var radio_props = [
        { label: 'Cash', value: 0 },
        { label: 'Credit Card', value: 1 },
        { label: 'Others', value: 2 }
    ];

    useEffect(function () {
        setRadioButtonText()
    }, [radioValue]);

    function setRadioButtonText() {
        switch (radioValue) {
            case 0:
                setRadioText('Cash');
                break;
            case 1:
                setRadioText('Credit Card');
                break;
            case 2:
                setRadioText('Others');
                break;
            default:
                setRadioText('Cash');
        }
    }

    function getInvoiceFromServer() {
        getJobInvoice('21', result => {
            console.log('1 1  1 1 1 1 Result Here . : ', result);
        })
    }
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader
                title="Get Payment"
            />
            {/* <Dialog
                visible={showInvoice}
                onTouchOutside={() => setShowInvoice(false)} >
                <View style={{ height: '80%' }}>
                    <WebView source={{ uri: 'http://72.255.38.246:8080/api/get_job_invoice/eyJpdiI6IlVDVmRUVnRQRE5OMmVsdk4veHhQb3c9PSIsInZhbHVlIjoiWGhNNmJoUHVMcVlaYk8zcVdOVFlEZz09IiwibWFjIjoiZTUxNTQ0MGE1YTFhMDMwODg1ZWI2YmMyMzZhOTMwODhiNGI0ZmViM2U5M2VjNTdjNTg5MWE2YTJiOTNlNjFlNSJ9' }}
                        style={{ width: '100%', height: '100%' }} />
                </View>
            </Dialog> */}
            <View style={styles.paymentRow}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.paymentRowText}>Total : </Text>
                    <Text style={styles.paymentRowText}>5099</Text>
                </View>
                <Button title="Invoice"
                    onPress={() => setShowInvoice(true)}
                    containerStyle={{ width: 90, alignSelf: 'flex-end', }}
                />
            </View>
            <Divider />

            <View style={styles.paymentMethodRow}>
                <Text style={styles.paymentMethodText}>Payment Method :</Text>
                <RadioForm
                    animation={true}
                    style={{ marginTop: 15 }}
                    initial={0}>
                    {
                        radio_props.map((obj, i) => (
                            <RadioButton labelHorizontal={true} key={i} >
                                <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={radioValue === i}
                                    onPress={value => setRadioValue(value)}
                                    borderWidth={2}
                                    buttonInnerColor={colors.colorPrimaryLight}
                                    buttonOuterColor={colors.colorPrimary}
                                    buttonSize={18}
                                    buttonWrapStyle={{ marginLeft: 4, marginTop: 6 }}
                                />
                                <RadioButtonLabel
                                    obj={obj}
                                    index={i}
                                    labelHorizontal={true}
                                    onPress={value => setRadioValue(value)}
                                    labelStyle={{ fontSize: 18, color: '#000000', marginTop: 6 }}
                                />
                            </RadioButton>
                        ))
                    }
                </RadioForm>

                <Input
                    placeholder='Collected Amount'
                    value={amount}
                    onChangeText={value => setAmount(value)}
                    containerStyle={{ marginTop: 15 }}
                    keyboardType='numeric'
                />

                <Button title="Send"
                    onPress={() => alert('here iss')}
                    containerStyle={{ marginHorizontal: 50 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    paymentRow: {
        marginVertical: 15,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    paymentRowText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    paymentMethodRow: {
        margin: 15
    },
    paymentMethodText: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default GetPayment;