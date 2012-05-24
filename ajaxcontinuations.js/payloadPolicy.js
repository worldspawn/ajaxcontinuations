ContinuationModule.Policies.PayloadPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    console.log(continuation.resultName);
    return continuation.resultName != null;// && continuation.model != null;
  };
  this.execute = function (continuation) {
    this.continuationModule.eventAggregator.publish(continuation.resultName, continuation.model);
  };
};

