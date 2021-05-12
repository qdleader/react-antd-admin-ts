import {observable, makeAutoObservable, action} from 'mobx';

export default class LeftBarStore {
    @observable
    public collapsed: boolean = false

    constructor(collapsed: boolean = false) {
        this.collapsed = collapsed
        makeAutoObservable(this)
    }

    @action 
    changeCollapsed = (collapsed: boolean) => {
        this.collapsed = collapsed
    }
}