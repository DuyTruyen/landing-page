import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appointmentStatusString'
})
export class StatusToTextPipe implements PipeTransform {
    transform(status: any): string {
        const parsed = parseInt(status);
        switch (parsed) {
            case 1:
                return 'Chờ xác nhận';
            case 2:
                return 'Đang xử lý';
            case 3:
                return 'KH đã xác nhận';
            case 4:
                return 'KH tắt máy';
            case 5:
                return 'Đổ chuông chưa nghe máy';
            case 6:
                return 'KH đang bận';
            case 7:
                return 'Chờ KH kiểm tra thông tin';
            case 8:
                return 'Chờ NV kiểm tra thông tin';
            case 9:
                return 'KH hủy lịch hẹn';
            case 10:
                return 'KH đã đến';
            default: return '';
        }
    }

}
