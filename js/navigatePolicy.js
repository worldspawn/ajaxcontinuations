ContinuationModule.Policies.NavigatePolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.redirectUri != undefined && continuation.redirectUri != '';
  };
  this.execute = function (continuation) {
    this.continuationModule.windowService.navigateTo(continuation.redirectUri);
  };
}