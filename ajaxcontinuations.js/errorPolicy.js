ContinuationModule.Policies.ErrorPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.errors && continuation.errors.length != 0;
  };
  this.execute = function (continuation) {
    this.continuationModule.eventAggregator.publish('ContinuationError', continuation);
  };
};

