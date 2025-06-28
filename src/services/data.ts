import api from './api'

export const getUserData = async() =>{
    try{
        const response = await api.get('/auth/dashboard')
        if(response.status === 200){
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }catch(error){
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const getOverallStats = async() =>{
    try{
        const response = await api.get('/progress/overall')
        if(response.status === 200){
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }catch(error){
        console.error("Error fetching overall stats:", error);
        throw error;
    }
}

export const getUserProgress = async() =>{
    try{
        const response = await api.get('/analytics')
        if(response.status === 200){
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    }catch(error){
        console.error("Error fetching user progress:", error);
        throw error;
    }
}