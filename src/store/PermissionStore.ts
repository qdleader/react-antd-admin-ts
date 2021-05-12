import {IRouter} from "../router";
import {action, makeAutoObservable, runInAction} from "mobx";
import {getAdminPermissionList} from "../api/permission";

export default class PermissionStore {
    permissionList: IRouter[] = []
    state: string = 'loading'

    constructor() {
        makeAutoObservable(this)
    }

    @action
    initPermission = async () => {
        const permissionList = await getAdminPermissionList().then(response => {
            // console.log("response",response)
            return response.data.data
        })
        runInAction(() => {
            // console.log("permissionList",permissionList)
            this.permissionList = permissionList
            this.state = 'success'
        })
    }

}
