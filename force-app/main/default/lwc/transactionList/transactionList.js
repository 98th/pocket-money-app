import {LightningElement, wire, track, api} from 'lwc';
import Id from '@salesforce/user/Id';
import getTransactions from '@salesforce/apex/UserController.getTransactions';
import { updateRecord, deleteRecord, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import TRANSACTION_OBJECT from '@salesforce/schema/Transaction__c';
import NAME_FIELD from '@salesforce/schema/Transaction__c.Name';
import AMOUNT_FIELD from '@salesforce/schema/Transaction__c.Amount__c';
import CREATION_DATE_FIELD from '@salesforce/schema/Transaction__c.Creation_date__c';
const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text', editable: true },
    { label: 'Amount', fieldName: AMOUNT_FIELD.fieldApiName, type: 'number', editable: true },
    { label: 'Date of Creation', fieldName: CREATION_DATE_FIELD.fieldApiName, type: 'text' }
];
 
export default class transactionList extends LightningElement {
    @api recordId;
    @track draftValues = [];
    @track columns = COLUMNS;
    userId = Id;
    @wire(getTransactions, {searchId : '$userId'})
    transactions;

    handleSave(event) {

        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);            
            return { fields };
        });
        
        let promises = new Set();
        for(let i = 0; i < recordInputs.length; i++){
            if(JSON.stringify(recordInputs[i].fields.Id).includes('row-')){
                delete recordInputs[i].fields.Id;
                recordInputs[i].apiName = TRANSACTION_OBJECT.objectApiName;
                recordInputs[i].fields.User__c = Id;
                recordInputs[i].fields.OwnerId = Id;
                promises.add(createRecord(recordInputs[i]))
            }
            else{              
                promises.add(updateRecord(recordInputs[i]));
            }
        }

        Promise.all(promises).then(records => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Transaction updated',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            return refreshApex(this.transactions);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });        
    }

    getSelectedRecords(event) {
        const selectedRows = event.detail.selectedRows;        
        this.recordsCount = event.detail.selectedRows.length;
        let conIds = new Set();

        for (let i = 0; i < selectedRows.length; i++) {
            conIds.add(selectedRows[i].Id);
        }
        this.selectedRecords = Array.from(conIds);
        if(this.recordsCount > 0){
            this.isDeleteButtonDisabled = false;
        }
        else{
            this.isDeleteButtonDisabled = true;
        }
    }

    createTransaction() {
        let newTransaction = {Id:"", name:"", amount__c:""};
        this.transactions.data = [...this.transactions.data, newTransaction];
    }

    deleteTransactions(){
        if(this.selectedRecords){
            let promises = new Set();
            for(let i = 0; i < this.selectedRecords.length; i++){
                promises.add(deleteRecord(this.selectedRecords[i])); 
            }
        
            Promise.all(promises).then(records =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact deleted',
                        variant: 'success'
                    })
                );                
                this.selectedRecords = [];
                this.isDeleteButtonDisabled = true;
                return refreshApex(this.contacts);
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            }); 
        }
    }
}