import AsyncStorage from '@react-native-community/async-storage';

export async function getJobList () {
    try {
        let jobList = await AsyncStorage.getItem('jobsList');
        let item = JSON.parse(jobList);
        return item;
    } catch (error) {
        console.log("Error While getting Store List.");
    }
}