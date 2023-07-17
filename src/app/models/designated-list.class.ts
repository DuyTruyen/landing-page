// import { array } from '@amcharts/amcharts4/core';

export class Contact {
  code = '';
  listCodeMapSystem = '';
  name = '';
  type = 1;
  otCodes = '';
  modality: any = null;
  categoryId = '';
  serviceCost = 0;
  insuranceCost = 0;
}

export class CodeMapSystem {
  otherSystem = '';
  otherSubClinicalCode: any;
}
export class CodeMapSystemOT {
  otherSystem = '';
  code: any;
}

export class DataSource {
    id = "";
    text :any;
}

export class DataTypeBoolean {
  text = '';
  valueNumber: any;
}

