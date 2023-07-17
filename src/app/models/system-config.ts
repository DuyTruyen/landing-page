export interface ISystemConfig {
    useExtendReportFields: boolean;
    useExtendPapsmearFields: boolean;
    supportLabelingModule: boolean;
    labelingMode: number;
    id?: string;
    onlyPrintWithApproved: boolean;
    onlyPrintWithInterpreted: boolean
}
export const DEFAULT_SYSTEM_CONFIG: ISystemConfig = {
    useExtendReportFields: false,
    useExtendPapsmearFields: false,
    supportLabelingModule: false,
    labelingMode: 1,
    onlyPrintWithApproved :true,
    onlyPrintWithInterpreted: true
};
