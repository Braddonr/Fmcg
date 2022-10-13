import { CommonModel } from '../../shared/models/common-model';

export class AuditTrail extends CommonModel {
    id: string;
    username: string;
    userAgent: string;
    ipAddress: string;
    date: Date;
    action: string;

    constructor() {
        super()
        this.allColumns = [
            { value: 'index', label: '#', checked: true, in_db: false, never_display: true },
            { value: 'id', label: 'ID', checked: true, in_db: true, never_display: false  },
            { value: 'userName', label: 'Username', checked: true, in_db: true, never_display: false  },
            { value: 'userAgent', label: 'User Ageny', checked: true, in_db: true, never_display: false  },
            { value: 'ipAddress', label: 'IP Address', checked: true, in_db: true, never_display: false  },
            { value: 'date', label: 'Date', checked: true, in_db: true, never_display: false  },
            { value: 'action', label: 'Action', checked: true, in_db: true, never_display: false  },
            { value: 'actions', label: 'Actions', checked: true, in_db: false , never_display: false }
        ];
        this.resource = {'id': '', 'label': 'Audit Trail'}
    }
}
