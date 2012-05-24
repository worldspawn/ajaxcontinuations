ContinuationModule.Policies.RefreshPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.refresh && continuation.refresh.toString() === 'true';
  };
  this.execute = function (continuation) {
    this.continuationModule.windowService.refresh();
  };
};

