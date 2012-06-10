ContinuationModule.Policies.ResultPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.resultName != null;
  };
  this.execute = function (continuation) {
    this.continuationModule.eventAggregator.publish(continuation.resultName, continuation.model);
  };
};

