@isTest
public with sharing class RollUpTransactionAmountTest {

    @isTest static void shouldInsertAndCountBalance() {
        User testUser = getUser();
        insert testUser;
        
        Test.startTest();
        Transaction__c transaction1 = new Transaction__c(amount__c = 10, User__c = testUser.id);
        insert transaction1;
        Transaction__c transaction2 = new Transaction__c(amount__c = -1, User__c = testUser.id);
        insert transaction2;
        Test.stopTest();
        testUser = [SELECT id, balance__c FROM user WHERE alias = 'iivan'];
        System.assertEquals(9, testUser.Balance__c);
    }
    
    @isTest static void shouldUpdateAndCountBalance () {
        User testUser = getUser();
        insert testUser;
        
        Test.startTest();
        Transaction__c transaction1 = new Transaction__c(amount__c = 10, User__c = testUser.id);
        insert transaction1;
        testUser = [SELECT id, balance__c FROM user WHERE alias = 'iivan'];
        System.assertEquals(10, testUser.Balance__c);
        transaction1.amount__c = 20;
        update transaction1;
        testUser = [SELECT id, balance__c FROM user WHERE alias = 'iivan'];
        System.assertEquals(20, testUser.Balance__c);
        Test.stopTest();
        
    }
  
    private static User getUser(){
        Profile profileId = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        return new User(LastName = 'ivanov',
                        FirstName='ivan',
                        Alias = 'iivan',
                        Email = 'ivan.ivanov@asdf.com',
                        Username = 'ivan.ivanov@asdf.com',
                        balance__c = 0,
                        ProfileId = profileId.id,
                        TimeZoneSidKey = 'GMT',
                        LanguageLocaleKey = 'en_US',
                        EmailEncodingKey = 'UTF-8',
                        LocaleSidKey = 'en_US'
                    );
    }
}