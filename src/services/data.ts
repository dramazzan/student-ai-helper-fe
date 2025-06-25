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