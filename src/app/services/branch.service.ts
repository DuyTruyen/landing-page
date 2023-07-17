import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root',
})
export class BranchService extends BaseService {
    override url = '/Branch';

    addUser(userId:string,branchId:string): Observable<any> {
        return this.post(`${this.url}/AddUser`, {userId,branchId});
    }

    removeUser(userId:string,branchId:string): Observable<any> {
        return this.post(`${this.url}/RemoveUser`,{userId,branchId});
    }

    toggleBranch(brandID: string): Observable<any> {
        return this.put(`${this.url}/Toggle/${brandID}`, null);
    }

    searchBranch(payload: any): Observable<any> {
        return this.post(`${this.url}/Search`, payload);
    }

    getUsersInBranch(branchId:string){
        return this.get(`${this.url}/User/${branchId}`);
    }
}
