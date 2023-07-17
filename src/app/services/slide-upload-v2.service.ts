import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INIT_UPLOAD_KEY_IMAGE_DATA } from '../models/upload-key-image-data';
import { AppConfigService } from '../shared/app-config.service';
import { NotificationStateService } from '../shared/app-state/notification-state.service';
import { Constants, StorageKeys } from '../shared/constants/constants';
import Utils from '../shared/helpers/utils';
import { NotificationService } from '../shared/notification.service';

const BYTES_PER_CHUNK = 50 * 1024 * 1024; // sample chunk sizes. 10MB

@Injectable({
  providedIn: 'root'
})
export class SlideUploadServiceV2 {
  baseUrl = '';

  constructor(
    public httpClient: HttpClient,
    protected configService: AppConfigService,
    private notificationState: NotificationStateService,
    private notification: NotificationService,
  ) {
    this.baseUrl = this.configService.getConfig().deepzoom.baseUrl;
  }

  preUpload(payload: any): Observable<any> {
    const token = localStorage.getItem(StorageKeys.TOKEN);
    return this.httpClient.post(
      `${this.baseUrl}/api/UploadV2/preUpload`,
      payload,
      {
        headers: {
          contentType: "application/json; charset=utf-8",
          Authorization: 'Bearer ' + token,
        },
      },
    );
  }

  upload(fileParam: any, slideId:string,slideData:any,completedPart:number =0,keyImageData?:any) {
    console.log(arguments);

    const token = localStorage.getItem(StorageKeys.TOKEN);
    let file = new File([fileParam], fileParam.name, { type: fileParam.type });
    let data = JSON.parse(JSON.stringify(slideData));
    let chunkCount = 0;
    let totalChunk = 0;
    let $this = this;
    let uploadProgress = 0;
    function setUploadProgress(value: number) {
      uploadProgress = value;
      $this.notificationState.updateProgress(slideId, value);
    }
    function uploadFile() {
      let SIZE = file.size;
      let start = 0;
      let end = BYTES_PER_CHUNK;
      chunkCount = 0;
      if(completedPart > 0) {
        start = completedPart * BYTES_PER_CHUNK;
        end =  start + BYTES_PER_CHUNK
        chunkCount = completedPart;

        }
      totalChunk = SIZE % BYTES_PER_CHUNK == 0 ? SIZE / BYTES_PER_CHUNK : Math.floor(SIZE / BYTES_PER_CHUNK) + 1;
      console.log(totalChunk);

      if(completedPart>0){
        $this.notificationState.updateState(slideId,Constants.UPLOAD_STATUS.UPLOADING)
      }
      else{
        $this.notificationState.addNotification({
            id: slideId,
            patientName: data.patientName,
            fileName: data.fileName,
            caseStudyId: data.caseStudyId,
            fileSize: SIZE,
            markerTypeName: data.markerTypeName,
            fileSizeStr: Utils.humanFileSize(SIZE),
            uploadProgress: 0,
            state: Constants.UPLOAD_STATUS.UPLOADING
          });
      }

      // recursive upload
      uploadOne(start, end);
    }
    function uploadOne(start: number, end: number) {
        console.log('upload one', arguments);

      let chunk = file.slice(start, end);
      let _xhr = new XMLHttpRequest();
      _xhr.onload = function () {
        chunkCount = chunkCount + 1;
        start = end;
        end = start + BYTES_PER_CHUNK;
        if (chunkCount < totalChunk) {
          uploadOne(start, end);
        } else if (chunkCount == totalChunk) {
            console.log('uploadComplete');

          uploadComplete();
        }
      };
      function onProgress(e: any) {
        if (e.lengthComputable) {
          let _loadedAll = chunkCount * BYTES_PER_CHUNK;
          let percentComplete = ((_loadedAll + e.loaded) / file.size) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      };
      _xhr.upload.addEventListener('progress', onProgress, false);
      _xhr.open("POST", `${$this.baseUrl}/UploadV2/MultiUpload/${slideId}/${chunkCount}`, true);
      _xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      _xhr.send(chunk);
    }
    function uploadComplete() {
      let formData = new FormData();

      formData.append('slideId',slideId);
      formData.append('createKeyImage', keyImageData?.createKeyImage+'');
      formData.append('isPrintKeyImage', keyImageData?.isPrintKeyImage+'');
      formData.append('keyImageTitle', keyImageData?.keyImageTitle);
      formData.append('keyImageNote', keyImageData?.keyImageNote);

      let xhr2 = new XMLHttpRequest();
      xhr2.onreadystatechange = function () {
        if (xhr2.readyState == XMLHttpRequest.DONE) {
          let res = JSON.parse(xhr2.responseText);
          if (res.isValid) {
            $this.notification.success('Đã tải lên. Đang đợi server xử lí', '');
            $this.notificationState.updateState(slideId, Constants.UPLOAD_STATUS.PROCESSING);
          }
          else {
            $this.notification.error('Không thể tải lên', res.d.errors[0].errorMessage);
            $this.notificationState.removeNotification(slideId);
          }
        }
      };
      xhr2.open("POST", `${$this.baseUrl}/UploadV2/UploadComplete`, true); //combine the chunks together
      xhr2.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr2.send(formData);
    }
    uploadFile();
  }
  getCompletePartUpload(slideId:string){
    const token = localStorage.getItem(StorageKeys.TOKEN);
    return this.httpClient.get(
      `${this.baseUrl}/api/UploadV2/Retry/${slideId}`,
      {
        headers: {
          contentType: "application/json; charset=utf-8",
          Authorization: 'Bearer ' + token,
        },
      },
    );
  }
}
