export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  summaries: string[];   
  tests: string[];       
  emailToken?: string;
  isVerified: boolean;
  verificationToken?: string;
  verifyTokenExpires?: string;
}


export interface LoginDto{
    email: string;
    password: string;
}

export interface RegisterDto{
    name: string;
    email: string;
    password: string;
    
}
