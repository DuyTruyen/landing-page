export class Constants {
  public static readonly FIREBASE_TOKEN = 'fb-token';
  public static readonly OBJECT_ID_EMPTY = '000000000000000000000000';
  public static readonly TABLE_PARAM = {
    PAGE_SIZE: 40,
  };
  public static readonly LAYOUT_CONFIG = {
    DEFAULT_FULL: 1,
    DEFAULT_DUAL: 2,
    VT: 3,
    INIT: 99,
  };
  public static readonly ACTIONS = {
    EDIT: 0,
    DELETE: 1,
  };

  public static readonly GENDERS = [
    { label: 'Nam', value: '1' },
    { label: 'Nữ', value: '0' },
  ];

  public static readonly APPOINTMENT_STATUS = [
    { label: 'Chờ xác nhận', value: 1 },
    { label: 'Đang xử lý', value: 2 },
    { label: 'KH đã xác nhận', value: 3 },
    { label: 'KH tắt máy', value: 4 },
    { label: 'Đổ chuông chưa nghe máy', value: 5 },
    { label: 'KH đang bận', value: 6 },
    { label: 'Chờ KH kiểm tra thông tin', value: 7 },
    { label: 'Chờ NV kiểm tra thông tin', value: 8 },
    { label: 'KH hủy lịch hẹn', value: 9 },
    { label: 'KH đã đến', value: 10 },
  ];

  public static readonly APPOINTMENT_PRIORITY = [
    { label: 'Not set', value: 0 },
    { label: 'Cao', value: 1 },
    { label: 'Trung bình', value: 2 },
    { label: 'Thấp', value: 3 },
  ];

  public static readonly VALUE_OPERATION = [
    { label: 'OR', value: 1 },
    { label: 'AND', value: 2 },
  ];

  public static readonly SESSION = [
    { label: 'Sáng', value: 1 },
    { label: 'Chiều', value: 2 },
  ];
}
export class StorageKeys {
  public static readonly TOKEN = 'token';
  public static readonly USER = 'user';
  public static readonly ADMIN_DASHBOARD = 'admin';
  public static readonly LOGIN_FAIL = 'Incorrect username and/or password.';
}

export class Roles {
  public static readonly ADMIN = 1;
  public static readonly USER_MANAGE = 2;
  public static readonly GROUP_MANAGE = 3;
  public static readonly CUSTOMER = 100;
}
