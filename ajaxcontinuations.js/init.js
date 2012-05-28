﻿(function ($, global) {
  var aggregator = {
    publish: function (topic, payload) {
      $(document).trigger(topic, payload);
    },
    subscribe: function (topic, context, callback) {
      $(document).bind(topic, context, callback);
    }
  };

  global.Continuations = new ContinuationModule(aggregator, [
    ContinuationModule.Policies.ResultPolicy,
    ContinuationModule.Policies.ErrorPolicy,
    ContinuationModule.Policies.NavigatePolicy,
    ContinuationModule.Policies.RefreshPolicy
  ]);
}(jQuery, this));