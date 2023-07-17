import { Constants } from "../shared/constants/constants";

interface Filter {
    field: string;
    key: string;
    value: string;
}

interface Sort {
    field: string;
    value: string;
}

export interface IUserSetting {
    layout: number;
    branchId: string,
    themeType:number,
    useKeyImageConstraint: boolean;
    keyImageConstraintWidth: number;
    keyImageConstraintHeight: number;
    keyImagePixelWidth: number;
    name: string;
    roleFilter1: Filter;
    roleFilter2: Filter;
    roleSort1: Sort;
    roleSort2: Sort;
}

export const INIT_USER_SETTING: IUserSetting = {
    layout: 0,
    themeType:1,
    useKeyImageConstraint: true,
    keyImageConstraintWidth: 3,
    keyImageConstraintHeight: 2,
    keyImagePixelWidth: 500,
    branchId: Constants.OBJECT_ID_EMPTY,
    name: "",
    roleFilter1: {
        field: "",
        key: "",
        value: ""
    },
    roleFilter2: {
        field: "",
        key: "",
        value: ""
    },
    roleSort1: {
        field: "",
        value: ""
    },
    roleSort2: {
        field: "",
        value: ""
    }
};
