import { Constants } from "../shared/constants/constants";

export interface SearchCaseStudy {
  patientName: string;
  patientCode: string;
  requestType: string;
  from: Date | string;
  to: Date | string;
  approveFrom: string;
  approveTo: string;
  page: number;
  pageSize: number;
  status: any;
  conclusion: string;
  diagnose: string;
  specimensCode: string;
  sort: RoleSort[];
  cols: Cols[];
  hasSlide?: number;
  hasConclusion?: number;
  isApprove?: number;
  isPrint?: number;
  branchId: string;
  [key: string]: any;
}
export const INIT_SEARCH_CASE_STUDY : SearchCaseStudy = {
  patientName: '',
  patientCode: '',
  requestType: '',
  branchId : Constants.OBJECT_ID_EMPTY,
  from: '',
  to: '',
  approveFrom: '',
  approveTo: '',
  page: 1,
  pageSize: 50,
  status: '',
  conclusion: '',
  diagnose: '',
  specimensCode: '',
  sort: [],
  cols: [],
  hasSlide: 10,
  hasConclusion: 10,
  isApprove: 10,
  isPrint: 10,
};
export interface RoleFilter{
    field: string;
    key : string;
    value: any;
}
export interface RoleSort{
    field: string;
    dir: string;
}
export interface Cols {
    field: string;
    header: string;
}
