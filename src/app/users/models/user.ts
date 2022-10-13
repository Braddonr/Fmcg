import { CommonModel } from "src/app/common/models/common-model";


export class User extends CommonModel {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profileId: string;
    remarks: string;

    constructor() {
        super()
        this.allColumns = [
            { value: 'index', label: '#', checked: true, in_db: false, never_display: true },
            { value: 'id', label: 'ID', checked: false, in_db: true, never_display: false  },
            { value: 'fullName', label: 'Full Name', checked: true, in_db: true , never_display: false },
            { value: 'username', label: 'Username', checked: true, in_db: true, never_display: false  },
            
            // { value: 'firstName', label: 'First Name', checked: true, in_db: true, never_display: false  },
            { value: 'profileId', label: 'Profile ID', checked: false, in_db: true, never_display: false  },
            { value: 'phoneNumber', label: 'Phonenumber', checked: true, in_db: true, never_display: false  },
            { value: 'email', label: 'Email', checked: true, in_db: true, never_display: false  },
            { value: 'status', label: 'Status', checked: true, in_db: true, never_display: false  },
            { value: 'actions', label: 'Actions', checked: true, in_db: false , never_display: false }
        ];
        this.resource  = {'id': '', 'label': 'Users'};
    }
}
