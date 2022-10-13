export class RegistrationForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}