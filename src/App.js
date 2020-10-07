import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator, createAppContainer} from "react-navigation";
import LoginScreen from './Login/Login';
import HomeScreen from './DashBoard/Home';
import JobDetail from './DashBoard/JobDetail';
import JobCompleted from './DashBoard/JobCompleted';
import DayCompleted from './DashBoard/DayCompleted';
import BreakTime from './DashBoard/BreakTime';

const AppNavigator = createStackNavigator({

        LoginScreen: {
            screen: LoginScreen
        },
        HomeScreen: {
            screen: HomeScreen
        },
        JobDetail: {
            screen: JobDetail
        }, DayCompleted: {
            screen: DayCompleted
        }, JobCompleted: {
            screen: JobCompleted
        },
        BreakTime: {
            screen: BreakTime
        }
    },
    {
        initialRouteName: "LoginScreen"
    });

export default createAppContainer(AppNavigator);
