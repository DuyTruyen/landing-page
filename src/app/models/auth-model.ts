export interface IAuthModel {
    //   userId?: string | null;
    id?: number;
    username?: string;
    avatar?: string;
    menus?: any[];
    roles?: any[];
    fullname?: string;
}
export const INIT_AUTH_MODEL: IAuthModel = {
    //   userId: '',
    id: 1,
    username: '',
    avatar: '',
    menus: [],
    roles: [],
    fullname: ''
};
