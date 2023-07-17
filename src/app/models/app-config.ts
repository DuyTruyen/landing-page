export class AppConfig {
  api: {
    baseUrl: string,
    fileUrl: string,
  };
  deepzoom: {
    baseUrl: string
  };
  domain: string;
  sharedUrl: string;
  layout: number;
  slogan: {
    content: string,
    author: string
  };
  viewerConfig: any;
  isEnablePapsmear: boolean;
  initData:any;

  constructor() {
    this.api = {
      baseUrl: '',
      fileUrl: '',
    };
    this.deepzoom = {
      baseUrl: ''
    };
    this.domain = '';
    this.sharedUrl = '';
    this.layout = 1;
    this.slogan = {
      content: '',
      author: ''
    };
    this.viewerConfig = {};
    this.isEnablePapsmear = true;
    this.initData = {};
  }
}
