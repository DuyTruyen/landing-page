export interface IReport {
  id: string,
  caseStudyId: string,
  microbodyDescribe: string,
  consultation: string,
  recommendation: string,
  diagnose: string,
  readDoctor: string,
}
export const INIT_REPORT : IReport = {
  id: '',
  caseStudyId: '',
  microbodyDescribe: '',
  consultation: '',
  diagnose: '',
  readDoctor: '',
  recommendation: ''

};
