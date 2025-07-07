import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Table, TableModule } from "primeng/table";
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { URLCONSTANT } from '../../services/url-constant';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SpinnerService } from '../../services/Spinner/spinner.service';

@Component({
    selector: 'app-role-menu',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ToastModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        TagModule, TooltipModule,
        DrawerModule,
        ConfirmDialogModule
    ],
    templateUrl: './role-menu.component.html',
    styleUrls: ['./role-menu.component.css'],
    providers: [
        { provide: URLCONSTANT },
        { provide: CricketKeyConstant },
        { provide: MessageService },
        { provide: ConfirmationService }
    ],

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
    selectedMenus: { menu_id: string; name: string }[] = [];
    selectedMenuId: string = '';

    conditionConstants = CricketKeyConstant.condition_key;
    statusConstants = CricketKeyConstant.status_code;

    constructor(
        private apiService: ApiService,
        private formBuilder: FormBuilder,
        private msgService: MessageService,
        private snackBar: MatSnackBar,
        private urlConstant: URLCONSTANT,
        private confirmationService: ConfirmationService,
        public cricketKeyConstant: CricketKeyConstant,
        public SpinnerService: SpinnerService) {
        this.roleMenuForm = this.formBuilder.group({
            role_id: [''],
            role_name: ['', [Validators.required]],
            role_description: ['', [Validators.required]],
            parent_role: ['', [Validators.required]]
        })
    }



    ngOnInit(): void {
    this.SpinnerService.raiseDataEmitterEvent('on');
        setTimeout(() => {
            this.gridLoad();
        },)

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
                var uniquemoduleIds: any[] = [];

                for (var i = 0; i < this.menusData.length; i++) {
                    if (!uniquemoduleIds.includes(this.menusData[i].module_id) && this.menusData[i].module_id != 0) {
                        uniquemoduleIds.push(this.menusData[i].module_id);

                        var moduleObj: any = {};
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
            if (err.status_code === this.statusConstants.refresh &&
                err.error.message === this.statusConstants.refresh_msg) {
                this.apiService.RefreshToken();

            } else {
                this.failedToast(err.error);
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
            .filter((item: any) => item && item.is_checked)
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

    filterName(id: number): string {
        var name = this.menusData.filter((value: any) => value.menu_id === id)[0].menu_name
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
            default_menu_id: this.selectedMenuId ? this.selectedMenuId.toString() : "0",
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
                if (err.status_code === this.statusConstants.refresh &&
                    err.error.message === this.statusConstants.refresh_msg) {
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

    successToast(data: any) {
        this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

    }

    /* Failed Toast */
    failedToast(data: any) {
        this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
    }
    status(role_id: number, url: string) {
        const params: any = {
            user_id: this.user_id?.toString(),
            client_id: this.client_id?.toString(),
            role_id: role_id?.toString()
        };
        this.apiService.post(url, params).subscribe(
            (res: any) => {
                res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
            },
            (err: any) => {
                err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
            }
        );
    }


    StatusConfirm(role_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
        console.log(role_id);
        const AlreadyStatestatus =
            (actionObject.key === this.conditionConstants.active_status.key && currentStatus === 'Active') ||
            (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === 'InActive');

        if (AlreadyStatestatus) {
            return;
        }
        this.confirmationService.confirm({
            message: `Are you sure you want to ${actionObject.label} this Role?`,
            header: 'Confirmation',
            icon: 'pi pi-question-circle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            accept: () => {
                const url: string = this.conditionConstants.active_status.key === actionObject.key
                    ? this.urlConstant.activeRole
                    : this.urlConstant.deactivateRole;
                this.status(role_id, url);
                this.confirmationService.close();
            },

            reject: () => {
                this.confirmationService.close();
            }

        });
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
            if (err.status_code === this.statusConstants.refresh &&
                err.error.message === this.statusConstants.refresh_msg) {
                this.apiService.RefreshToken();

            } else {
                this.failedToast(err.error);
            }
        });
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
        this.SpinnerService.raiseDataEmitterEvent('on');
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
                    this.SpinnerService.raiseDataEmitterEvent('off');

                }, (err: any) => {
                    if (err.status_code === this.statusConstants.refresh &&
                        err.error.message === this.statusConstants.refresh_msg) {
                        this.apiService.RefreshToken();

                    } else {
                        this.SpinnerService.raiseDataEmitterEvent('off');
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
        },)


    }

    resetForm() {

        this.roleMenuForm.reset();
        this.submitted = false;

    }


    cancelForm() {
        this.ShowForm = false;
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
                this.showList();
                this.successToast(res);
                this.resetForm();
                if (this.addAnother == true) {
                    this.showAddForm()
                }
            }, (err: any) => {
                if (err.status_code === this.statusConstants.refresh &&
                    err.error.message === this.statusConstants.refresh_msg) {
                    this.apiService.RefreshToken();

                }
            });
        } else {

            params.action_flag = "create";
            const url = 'User/create_role';
            this.apiService.post(url, params).subscribe((res: any) => {
                this.showList();
                this.resetForm();
                this.successToast(res);
                if (this.addAnother == true) {
                    this.showAddForm()
                }
            },
                (err: any) => {
                    if (err.status_code === this.statusConstants.refresh &&
                        err.error.message === this.statusConstants.refresh_msg) {

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
    clears() {
        this.searchKeyword = '';
        this.dt.clear();
        this.gridLoad();
    }

}