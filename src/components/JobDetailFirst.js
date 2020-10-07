import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
let colors = require("../Themes/Color");
let moment = require('moment');

const JobDetailFirst = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginLeft: 10, }}>
                <Image
                    style={{ width: 35, height: 35 }}
                    source={props.leftIcon}
                />
            </View>
            <View style={{ marginLeft: 10, }}>
                <Text style={{ paddingBottom: 5, color: colors.colorGrayText }}>{props.heading}</Text>
                <Text style={{ fontWeight: '700' }}>{props.description}</Text>
            </View>
        </View>
    );
}

export default JobDetailFirst;