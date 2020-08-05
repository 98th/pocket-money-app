trigger RollUpTransactionAmount on Transaction__c (after insert, after update, after delete) {
    Set<Id> userId = new Set<Id>();
    Transaction__c [] transactions = Trigger.isDelete ? Trigger.old : Trigger.new;
    for (Transaction__c t : transactions) {
           userId.add(t.User__c);
    }

    Map<Id, User> userMap = new Map<Id, User>([SELECT Id, Balance__c
                                                  FROM User WHERE Id in :userId]);
    
    for(AggregateResult aggRes : [SELECT User__c, SUM(Amount__c)balance FROM Transaction__c
                                 WHERE User__c IN :userId GROUP BY User__c]) {
          userMap.get((Id)aggRes.get('User__c')).balance__c = (Decimal)aggRes.get('balance');
    }
   
    if(userMap != NULL && userMap.size() > 0) {
       update userMap.values(); 
    }  
 }