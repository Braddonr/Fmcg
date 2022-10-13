import { CommonModel } from "src/app/common/models/common-model";

export class Role extends CommonModel {
    id: number;
    name: string;
    remarks: any;
    enabled: any;
    created_on: string;
    created_by: string;
    constructor() {
      super();
      this.allColumns = [
        { value: 'index', label: '#', checked: true, in_db: false , never_display: false},
        { value: 'id', label: ' ID', checked: false, in_db: true, never_display: true },
        { value: 'name', label: 'Name', checked: true, in_db: true, never_display: false },
        { value: 'remarks', label: 'Remarks', checked: true, in_db: true, never_display: false },
        { value: 'enabled', label: 'Enabled', checked: true, in_db: true, never_display: false },
        { value: 'created_on', label: 'Created On', checked: false, in_db: true, never_display: false },
        { value: 'created_by', label: 'Created By', checked: false, in_db: false, never_display: true },
        { value: 'actions', label: 'Actions', checked: true, in_db: false, never_display: false }
      ];
      this.resource  = {'id': 'roles', 'label': 'Role'};
    }
  }




