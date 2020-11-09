import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import CustomHeader from '../components/CustomHeader';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import * as colors from '../Themes/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

function GetPayment() {
    const [radioValue, setRadioValue] = useState(0);
    const [radioText, setRadioText] = useState('');
    const [amount, setAmount] = useState('');
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
    console.log('@ ! ! ! 1 1 1 1 : Amount ', amount);
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader
                title="Get Payment"
            />

            <View style={styles.paymentRow}>
                <Text style={styles.paymentRowText}>Total Payment : </Text>
                <Text style={styles.paymentRowText}>5099</Text>
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
        margin: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
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