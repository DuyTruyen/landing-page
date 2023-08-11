import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService extends BaseService {
  override url = '/Group';
  getUsersInGroup(groupId: string) {
    return this.get(`${this.url}/User/${groupId}`);
  }
  removeUser(userId: string, groupId: string) {
    let payload = { userId, groupId };
    return this.post(`${this.url}/RemoveUserFromGroup`, payload);
  }
  addUser(payload:any) {
    return this.post(`${this.url}/AddUser2Group`, payload);
  }
  updateGroupRoles(payload:any) {
    return this.post(`${this.url}/UpdateGroupRoles`, payload);
  }
  getListGroupOfUser(userId: string) {
    return this.get(`${this.url}/UserGroup/${userId}`);
  }
  UpdateGroupOfUser(userId: string, groupIds:any[]) {
    let payload = { userId, groupIds };
    return this.put(`${this.url}/UserGroup/${userId}`,payload);
  }
  searchGroup(data: any) {
    return this.post(`${this.url}/Search`, data);
  }
}
