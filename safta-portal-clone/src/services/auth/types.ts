// export type LoginResponse={
//     message :string
//     data:{}
// }

import { APIResponse } from "../types";

export type LoginResponse=APIResponse<{user:{
    id: string;
    email: string;
    login_name : string;
    role_type: string;
},accessToken:string}>


export type LoginPayload={
    email:string;
    password:string
}


export type ForgotPasswordPayload={
    email:string
}   