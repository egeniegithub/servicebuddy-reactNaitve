import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Divider, } from 'react-native-elements';
let colors = require("../Themes/Color");
import JobDetailFirst from './JobDetailFirst';

const SingleRowJobDetail = (props) => {
    return (

        <View>
            <View style={{width:'100%', paddingTop:15,paddingBottom:15, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{width:'75%'}}>
                <JobDetailFirst heading={props.heading} description={props.description} leftIcon={props.leftIcon} />
                </View>
                <View style={{ marginRight: 10,marginLeft:15 }}>
                    <TouchableOpacity onPress={
                        props.methodForDirection
                   }>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={props.rightIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Divider style={{ backgroundColor: colors.colorGrayText, }} />
        </View>
    );

}
export default SingleRowJobDetail;