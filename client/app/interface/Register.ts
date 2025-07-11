
export interface BaseUserProps{
    name: string;
    username: string;
    phone: string;
    password: string;
}

export interface RegisterUserProps extends BaseUserProps {
    confirmpassword: string;
  }

export interface RegisterDriverProps extends RegisterUserProps{
    idProof:any;
}