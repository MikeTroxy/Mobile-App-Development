    export function EmailVerificationCheck (email) {
    if (email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)){
       return true;
    }
    else{
      return false;
    }
  }

  export function PasswordVerificationCheck (password) {
    if (password.match(/^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)){
      return true;
    }
    else{
      return false;
    }
  }