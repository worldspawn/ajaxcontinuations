ContinuationModule.Policies.PayloadPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.topic != null && continuation.model != null;
  };
  this.execute = function (continuation) {
    this.continuationModule.eventAggregator.publish(continuation.resultName, continuation.payload);
  };
}