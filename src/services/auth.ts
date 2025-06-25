import { LoginDto , RegisterDto } from "@/models/User";
import  api  from "@/services/api";

export const login = async (data : LoginDto) =>{
    try{
        const response = await api.post("/auth/login" , data)
        if(response.status !== 200){
            throw new Error("Ошибка при входе");
        }
        if(!response.data.success){
             throw new Error("Ошибка при входе");
        }

        return response.data;
    }catch(e){
        console.error("Login error:" , e)
        throw new Error("Ошибка при входе");
    }
}

export const register = async (data : RegisterDto) =>{
    try{
        const response = await api.post("/auth/register" , data)
        return response.data;
    }catch(e){
        console.error("Register error:" , e)
        throw new Error("Ошибка при регистрации");
    }
}


export const verify = async (token: any) =>{
    try{
        const response = await api.get(`/auth/verify-email?token=${token}`)
        console.log("Verify response:", response.data)
        return response.data;
    }catch(e){
        console.error("Verify error:" , e)
        throw new Error("Ошибка при верификации");
    }
}
