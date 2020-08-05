public with sharing class UserController {
    @AuraEnabled(cacheable=true)
    public static List<Transaction__c> getTransactions(Id searchId) {
        return [
            SELECT Id, Name, amount__c, creation_date__c
            FROM Transaction__c
            WHERE User__c = :searchId
            WITH SECURITY_ENFORCED
            ORDER BY Creation_Date__c DESC
       ];
    }

    @AuraEnabled(cacheable=true)
    public static User getUserDetails(Id searchId) {
        return [
            SELECT Name, Email, Address, Phone, Balance__c
             //     Transaction__r.Name, Transaction__r.amount__c, Transaction__c.Creation_date__c
            FROM User
            WHERE id = :searchId
            WITH SECURITY_ENFORCED
       ];
    }
}
