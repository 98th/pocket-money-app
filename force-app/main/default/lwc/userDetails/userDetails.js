import {LightningElement, wire, track} from 'lwc';
import getUserDetails from '@salesforce/apex/UserController.getUserDetails';
import Id from '@salesforce/user/Id';

export default class userDetails extends LightningElement {
    userId = Id;
    @track user;
    @track transactions;
    @track error;
    @wire(getUserDetails, {searchId : '$userId'})
    wiredUser({ error, data}) {
        if (data) {
            this.user = data;
        } else if (error) {
            this.error = error;
        }
    }
}