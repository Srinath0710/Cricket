import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Table, TableModule } from "primeng/table";
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';


@Component({
    selector: 'app-role-menu',
    templateUrl: './role-menu.component.html',
    styleUrls: ['./role-menu.component.css'],
    providers: [MessageService, DialogService],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ToastModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        TagModule, TooltipModule,
        DrawerModule
    ]
})
export class RoleMenuComponent implements OnInit, AfterViewInit {
    @ViewChild('dt') dt!: Table;

    visible = false;
    visibleDialog = false;
    searchKeyword: any;
    statuses = [];
    public totalRecords: any = '0';
    ShowForm = false;
    display_name: any;
    user_id = localStorage.getItem('user_id');
    client_id = localStorage.getItem('client_id');
    value: boolean = true
    public roleMenuForm!: FormGroup<any>;
    statusApi: any;
    statusValues: any;
    isEditMode: boolean = false;
    visibleShowConfirm: boolean = false
    ShowForm1: boolean = false;
    gridLoadData: any
    submitted: boolean = false
    roleDropdownData: any
    totalData: any = 0;
    addAnother: boolean = false;
    showPermission: boolean = false;
    choose_role: any;
    menusData: any = [];
    modules: any;
    envImagePath = environment.imagePath;
    selectedMenus:  { menu_id: string; name: string }[] = [];
    selectedMenuId: string = ''; 

    constructor(
        private apiService: ApiService, private formBuilder: FormBuilder, private msgService: MessageService,private snackBar: MatSnackBar) {

        this.roleMenuForm = this.formBuilder.group({
            role_id: [''],
            role_name: ['', [Validators.required]],
            role_description: ['', [Validators.required]],
            parent_role: ['', [Validators.required]]
        })
    }



    ngOnInit(): void {

        // this.spinnerService.raiseDataEmitterEvent('on');
        setTimeout(() => {
            this.gridLoad();
        }, 1000)

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.roleDropdown()

        }, 1000)
    }

    showAddForm() {
        this.ShowForm = true;
    }
    showPermissionTab() {
        this.showPermission = true
    }
    hidePermisssionTab() {
        this.showPermission = false

    }
    permissionOpen(role_id: any, role_name: any) {
        this.display_name = role_name
        this.showPermissionTab();
        const params: any = {};
          const client_id = 0;
       this.choose_role = role_id;
        params.user_id = this.user_id?.toString();
        params.role_id = role_id?.toString();
           params.client_id = client_id.toString();
        const url = 'User/get_menu_permissions';
        params.action_flag = "get_menu_permissions";

        this.apiService.post(url, params).subscribe((res: any) => {
            if (res.status_code == 200) {
                this.menusData = res.data;
                console.log(this.menusData);

                var modulesList: any[] = [];
                var uniquemoduleIds: any[] = []; // Initialize as an empty array

                for (var i = 0; i < this.menusData.length; i++) {
                    if (!uniquemoduleIds.includes(this.menusData[i].module_id) && this.menusData[i].module_id != 0) {
                        uniquemoduleIds.push(this.menusData[i].module_id);

                        var moduleObj: any = {}; // Initialize properly
                        moduleObj['module_id'] = this.menusData[i].module_id;
                        moduleObj['module_name'] = this.menusData[i].module_name;

                        modulesList.push(moduleObj);
                    }
                }
                this.modules = modulesList;
            } else {
                this.failedToast(res);
            }


        }, (err: any) => {
            if (err.status === 401 && err.error.message === "Expired") {
                this.apiService.RefreshToken();

            } else {
                this.failedToast(err);
            }
        });
    }

    accordianclick(moduleId: any) {
        for (var i = 0; i < this.modules.length; i++) {
            if (this.modules[i]['module_id'] == moduleId) {
                if (this.modules[i]['active'] != 1)
                    this.modules[i]['active'] = 1;
                else
                    this.modules[i]['active'] = 0;

            }
        }
    }
menuRolePermission(permissionform: NgForm) {
    console.log(permissionform);

    const menuIds = Object.values(permissionform.value)
        .filter((item: any) => item && item.is_checked) // Ensure item is not null
        .map((item: any) => ({ 
            menu_id: item.menu_id,
            name: this.filterName(item.menu_id)
        })); 

    console.log("Menus:", menuIds);

    if (menuIds.length === 0) {
        this.snackBar.open('No menu selected!', 'Close', { duration: 3000 });
        return;
    }

    this.selectedMenus = menuIds;
    console.log(this.selectedMenus);
    
    this.selectedMenuId = menuIds[0]?.menu_id; 
    this.openPopup();
}

filterName(id:number):string{
var name=this.menusData.filter((value:any)=>value.menu_id===id)[0].menu_name
    return name
}
openPopup() {
    const popup = document.getElementById("menuPopup");
    if (popup) popup.style.display = "block";
}

closePopup() {
    const popup = document.getElementById("menuPopup");
    if (popup) popup.style.display = "none";
}

confirmSelection(permissionform: NgForm) {
    if (!this.selectedMenuId) {
        this.snackBar.open('Please select a default menu!', 'Close', { duration: 3000 });
        return;
    }

    this.closePopup();

    const params: any = {
        user_id: this.user_id ? this.user_id.toString() : "0",
        role_id: this.choose_role ? this.choose_role.toString() : "0",
        client_id: this.client_id ? this.client_id.toString() : "0",
        menu_ids: this.selectedMenus.map(item => item.menu_id).join(','),
        default_menu_id: this.selectedMenuId    ? this.selectedMenuId.toString() : "0", 
        action_flag: "update",
        permissions: Object.values(permissionform.value).map((perm: any) => ({
            menu_id: perm.menu_id ?? null,
            create: perm.create ?? false,
            read: perm.read ?? false,
            modify: perm.modify ?? false,
            remove: perm.remove ?? false
        })),
    };

    this.apiService.post('User/update_menu_permissions', params).subscribe({
        next: (res: any) => {
            console.log(permissionform)
            if (res.status_code === '200') {
                this.snackBar.open('Permissions updated successfully', 'Close', { duration: 3000 });
                this.hidePermisssionTab();
                this.gridLoad();
                permissionform.reset();
            } else {
                this.snackBar.open('Failed to update permissions', 'Close', { duration: 3000 });
            }
        },
        error: (err: any) => {
            if (err.status === 401 && err.error?.message === "Expired") {
                this.apiService.RefreshToken();
            } else {
                this.snackBar.open('Error updating permissions', 'Close', { duration: 3000 });
            }
        },
    });
    
}
    isEnabled(value: any) {
        if (value === 1) {
            return value === 1
        } else {
            return value === 0
        }

    }



    /*  "CLEAR" button and "search box" on top of the table  */


    filterGlobal($event: any, stringVal: any) {
        this.dt?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }


    clear(table: Table) {
        table.clear();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'inactive':
                return 'danger';

            case 'active':
                return 'success';
        }
        return 'secondary';
    }



    showConfirm(url_name: any, data: any, status: any, status_key: any) {
        if (status == status_key) {
            return
        }
        this.statusApi = url_name;
        this.statusValues = data;
        if (!this.visibleShowConfirm) {
            this.msgService.add({
                key: 'confirm', sticky: true, severity: 'warn',
                summary: 'Are you sure?', detail: 'Confirm to proceed'
            });
            this.visibleShowConfirm = true;
        }
    }


    onConfirm() {
        this.msgService.clear('confirm');
        this.visibleShowConfirm = false;
        this.changeStatus(this.statusValues, this.statusApi);
        this.statusApi = '';
        this.statusValues = '';


    }

    onReject() {
        this.msgService.clear('confirm');
        this.visibleShowConfirm = false;
    }


    changeStatus(role_id: any, statusUrl: any) {
        const params: any = {};
        params.user_id = this.user_id?.toString();
        params.role_id = role_id.toString();
        const url = 'Common/' + statusUrl;
        params.action_flag = "activate";
        if (statusUrl == "deactivate_role") {
            params.action_flag = "deactivate";
        }

        this.apiService.post(url, params).subscribe((res: any) => {
            if (res.status_code == 200) {
                this.successToast(res);
                this.gridLoad();
            } else {
                this.failedToast(res)
            }

        }, (err: any) => {
            if (err.status === 401 && err.error.message === "Expired") {
                this.apiService.RefreshToken();

            } else {
                this.failedToast(err);
            }
        });
    }

    /* Success Toast */

    successToast(data: any) {
        this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

    }

    /* Failed Toast */
    failedToast(data: any) {
        this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
    }

    /* START -  GET DROPDOWN FUNCTION */

    roleDropdown() {
        const params: any = {};
        params.action_flag = 'grid_load';
        params.user_id = this.user_id?.toString();
        params.role_id = this.roleMenuForm.value.role_id.toString()
        const url = 'User/get_role_list';
        this.apiService.post(url, params).subscribe((res: any) => {
            this.roleDropdownData = res.data.parent_roles != undefined ? res.data.parent_roles : [];
        })
    }

    /* END - GET DROPDOWN FUNCTION */

    /* Start of Code for parent role data grid */
    gridLoad() {
        if (this.addAnother == false) {
            // this.spinnerService.raiseDataEmitterEvent('on');
            this.gridLoadData = []
            this.totalData = this.gridLoadData.length;
            setTimeout(() => {
                const params: any = {};
                params.action_flag = 'grid_load';
                params.user_id = this.user_id?.toString();
                const url = "User/get_role_list";
                this.apiService.post(url, params).subscribe((res: any) => {
                    this.gridLoadData = res.data.roles != undefined ? res.data.roles : [];
                    this.totalData = this.gridLoadData.length;
                    // this.spinnerService.raiseDataEmitterEvent('off');

                }, (err: any) => {
                    if (err.status === 401 && err.error.message === "Expired") {
                        this.apiService.RefreshToken();

                    } else {
                        // this.spinnerService.raiseDataEmitterEvent('off');
                        this.gridLoadData = []

                        this.totalData = this.gridLoadData.length;

                    }
                });

            })
        }
    }

    showList() {

        this.ShowForm = false;
        setTimeout(() => {
            this.gridLoad();
        }, 1000)
        this.gridLoad()


    }

    resetForm() {

        this.roleMenuForm.reset();
        this.submitted = false;

    }


    /*add roles*/
    addNewRole() {

        this.submitted = true;
        if (this.roleMenuForm.invalid) {
            this.roleMenuForm.markAllAsTouched();
            return
        }

        const params: any = {};
        params.user_id = this.user_id?.toString();
        params.role_name = this.roleMenuForm.value.role_name.toString();
        params.role_description = this.roleMenuForm.value.role_description.toString();
        params.parent_role_id = this.roleMenuForm.value.parent_role.toString();
       params.client_id = this.client_id?.toString();

        if (this.roleMenuForm.value.role_id !== null && this.roleMenuForm.value.role_id !== '') {
            params.role_id = this.roleMenuForm.get('role_id')?.value.toString();
            params.action_flag = 'update';
            const url = 'User/update_role';

            this.apiService.post(url, params).subscribe((res: any) => {
                setTimeout(()=>{
                    this.gridLoad();
                },100)
                this.successToast(res);
                this.showList();
                
                this.resetForm();
                if (this.addAnother == true) {
                    this.showAddForm()
                }
            }, (err: any) => {
                if (err.status === 401 && err.error.message === "Expired") {
                    this.apiService.RefreshToken();

                }
            });
        } else {

            params.action_flag = "create";
            const url = 'User/create_role';
            this.apiService.post(url, params).subscribe((res: any) => {
                this.gridLoad();
                this.showList();
                this.resetForm();
                this.successToast(res);
                if (this.addAnother == true) {
                    this.showAddForm()
                }
            },
                (err: any) => {
                    if (err.status === 401 && err.error.message === "Expired") {
                        this.apiService.RefreshToken();

                    }

                });
        }

        /* Create && Update competition code ENDS */

    }


    /*Edit function*/
    edit(role_id: any, role_name: any, role_description: any, parent_role_id: any) {
        this.isEditMode = true;
        this.roleMenuForm.setValue({
            role_id: role_id,
            role_name: role_name,
            role_description: role_description,
            parent_role: Number(parent_role_id)
        })
        this.showAddForm();
    }

    combinedClick() {
        this.showList();
        this.cancelAnotherForm();
    }
    cancelAnotherForm() {
        this.addAnother = false;
        this.gridLoad();
    }
      clears() {
  this.searchKeyword = '';   
  this.dt.clear();          
  this.gridLoad();          
}

}