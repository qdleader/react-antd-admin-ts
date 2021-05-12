import request from "../utils/request";

export const login = (name: string, password: string) => {
    return request({
        url: '/login',
        method: 'post',
        data: {name: name, password: password}
    })
}
