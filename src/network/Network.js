import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {loggedInUserId} from "../Login/Login";


const baseurl = "http://72.255.38.246:8080/api/";
const googleMapBaseurl = "https://maps.googleapis.com/maps/api/distancematrix/json?";
const token = 'eg3nieS1';
const GOOGLE_MAPS_API_KEY="AIzaSyD3XGW3PgTzix7BVHXCUUR79hf4lVpxdjw";
 class ApiNames {
    static login = baseurl + "tech_login";
    static getJobs = baseurl + 'get_jobs';
    static updateStatus = baseurl + 'status_change';
    static startBreak = baseurl + 'take_break';
}

export async function getActiveJobs(callback) {
    let params = {
        user_id: loggedInUserId,
    };
    let userToken = await AsyncStorage.getItem('token');
    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userToken
        },
        body: JSON.stringify(params),
    };
    processNetworkRequest(ApiNames.getJobs, request, callback, 30000);
}


export async function doLogin(email, password, callback) {
    let params = {
        email: email,
        password: password,
    };

    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         //body: formData,
        body: JSON.stringify(params),
    };
    processNetworkRequest(ApiNames.login, request, callback, 30000);
}
export async function updateStatus(job_id, status, estimatedTime,callback) {
    let params = {
        estime: estimatedTime,
        status: status,
        job_id: job_id,
        token: token,
    };

    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        //body: formData,
        body: JSON.stringify(params),
    };
    processNetworkRequest(ApiNames.updateStatus, request, callback, 30000);
}
export async function startBreak(duration,callback) {
    let params = {
        time: duration,
        user_id: loggedInUserId,
        token: token,
    };

    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        //body: formData,
        body: JSON.stringify(params),
    };
    processNetworkRequest(ApiNames.startBreak, request, callback, 30000);
}
export async function getEstimatedTime(currentLat,currentLong,destLat,destLong,callback){
    let url = googleMapBaseurl + "units=imperial&origins=" + currentLat + "," + currentLong +
        "&destinations=" + destLat + "," + destLong +
        "&key=" + GOOGLE_MAPS_API_KEY;
    let request = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    };
    processNetworkRequest(url, request, callback, 30000);
}

export async function reLogin(callback) {
    let userObject = await AsyncStorage.getItem('userObject');
    userObject = JSON.parse(userObject)
    let params = {
        email: userObject.email,
        password: userObject.password,
    };
    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         //body: formData,
        body: JSON.stringify(params),
    };
    processNetworkRequest(ApiNames.login, request, callback, 30000);
}

function processNetworkRequest(url, request, callback, TIME_OUT ) {
    let didTimeOut = false;
    new Promise( function (resolve, reject) {
        const timeout = setTimeout(() => {
            didTimeOut = true;
            reject(new Error('Request Time Out.'));
        }, TIME_OUT);

        fetch(url, request)
        .then(processResponse)
        .then(function (response) {
            
            if (response.status === 200 && response.data.status === 'failure') {
                let oldUrl = url;
                let oldRequest = request;
                let oldCallback = callback;
                reLogin(async result => {
                    await AsyncStorage.setItem('token', result.token.toString());
                    oldRequest.headers.Authorization = 'Bearer ' + result.token.toString();
                    processNetworkRequest(oldUrl, oldRequest, oldCallback, 30000);
                })
            }
            // Clear TimeOut As CleanUp
            clearTimeout(timeout);
            if(!didTimeOut) {
                resolve(response);
            }
        })
        .catch(function (err) {
            console.log("Fetch Request Failed ! : " + err);
            //Rejection already happend with setTimeOut
            if (didTimeOut) return;

            //reject with err
            reject(err);
        });
    })
    .then(function (response) {
        // Request success and no Timeout
        console.log("Request success and no Timeout" + response);
        callback(response.data);
    })
    .catch(function (err)  {
        // Response Error, Request TimeOut or Runtime Error
        err.didTimeOut = didTimeOut;
        console.log("Response Error, Request TimeOut or Runtime Error" + err);
        processError(err, callback);
    });

}
    function processResponse(response) {
        return new Promise((resolve, reject)=> {
        // will resolve or reject depending on status, will pass both "status" and "data" in either case
        let func;
        response.status < 400 ? func = resolve : func = reject;
        response.json().then(data => func({'status': response.status, 'data': data}))
        })
    }

    function processError(response, callback) {
        if (response.status !== undefined) {
            if (response.status < 500) {
                callback(response.data);
            }
            else if (response.status >= 500){
                let responseJson = {success: false, message: "Network Error! Request Failed" }
                callback(responseJson);
            }
        }
        else {
            let responseJson;
            if (response.didTimeOut) {
                responseJson = {success: false, message: "Request Network Timeout"};
            }
            else {
                responseJson = {success: false, message: "Network Error. Request Failed!"}
            }
            callback(responseJson);
        }
    }


