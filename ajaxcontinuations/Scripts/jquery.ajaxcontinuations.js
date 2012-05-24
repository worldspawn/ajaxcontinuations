/*
$.continuations = new $.continuationModule(eventAgreggrator, [
  jQuery.continuationModule.Policies.PayloadPolicy,
  jQuery.continuationModule.Policies.ErrorPolicy,
  jQuery.continuationModule.Policies.NavigatePolicy,
  jQuery.continuationModule.Policies.RefreshPolicy
])
*/

(function ($, global) {
  if (typeof ($) !== 'function') {
    throw 'jQuery.ajaxcontinuations: jQuery not found.'
  }

  var CORRELATION_ID = 'X-Correlation-Id'

  function AjaxContinuation() { }
  
  AjaxContinuation.prototype = {
    success: false,
    refresh: false,
    messages: []
  }

  function ContinuationModule(eventAgreggator, policies) {
    this.eventAgreggator = eventAgreggator;
    this.init();
    for (var i = 0; i < policies.length; i++)
      this.applyPolicy(new policies[i](this))
  };
  
  ContinuationModule.prototype = {
    policies: [],
    init: function () {
      var self = this;
      $(document).ajaxComplete(function (e, xhr) {
        self.eventAgreggator.publish('AjaxCompleted', {
          correlationId: xhr.getResponseHeader(CORRELATION_ID),
          xhr: xhr
        })
      })

      $.ajaxSetup({
        cache: false,
        success: function (continuation, status, jqXHR) {
          self.onSuccess({
            continuation: continuation,
            status: status,
            response: jqXHR
          })
        },
        error: function (jqXHR, status) {
          self.onError({
            status: status,
            response: jqXHR
          })
        },
        beforeSend: function (xhr) {
          self.setupRequest(xhr, self)
        }
      })
    },
    onSuccess: function (msg) {
      var contentType = msg.response.getResponseHeader('Content-Type');
      if (!contentType || contentType.indexOf('json') == -1) {
        return;
      }

      var continuation = msg.continuation;
      continuation.correlationId = msg.response.getResponseHeader('X-Correlation-Id');
      
      this.process(continuation);
    },
    onError: function (msg) {
      var contentType = msg.response.getResponseHeader('Content-Type');
      if (!contentType || contentType.indexOf('json') == -1) {
        return;
      }

      var continuation = $.parseJSON(msg.response.responseText);
      continuation.correlationId = msg.response.getResponseHeader('X-Correlation-Id');

      this.process(continuation);
    },
    // Keep this public for form correlation
    setupRequest: function (xhr, settings) {
      // this could come from $.ajaxSubmit
      var id = this.correlationId;
      if (!id) {
        id = new Date().getTime().toString();
      }
      xhr.setRequestHeader(CORRELATION_ID, id);
      
      settings.eventAgreggator.publish('AjaxStarted', {
        correlationId: id,
        xhr: xhr
      });
    },
    applyPolicy: function (policy) {
      this.policies.push(policy);
      return this;
    },
    process: function (continuation) {
      continuation = $.extend(new AjaxContinuation(), continuation);
      var matchingPolicies = [];
      console.log(this.policies);
      for (var i = 0; i < this.policies.length; ++i) {
        var p = this.policies[i];
        if (p.matches(continuation)) {
          matchingPolicies.push(p);
        }
      }
      console.log(matchingPolicies);
      for (var i = 0; i < matchingPolicies.length; ++i) {
        matchingPolicies[i].execute(continuation);
      }
    }
  };

  ContinuationModule.Policies = {};
  global.ContinuationModule = ContinuationModule;
} (jQuery, window));

﻿ContinuationModule.Policies.ErrorPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.errors && continuation.errors.length != 0;
  };
  this.execute = function (continuation) {
    this.continuationModule.eventAggregator.publish('ContinuationError', continuation);
  };
};

﻿ContinuationModule.Policies.NavigatePolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.redirectUri != undefined && continuation.redirectUri != '';
  };
  this.execute = function (continuation) {
    this.continuationModule.windowService.navigateTo(continuation.redirectUri);
  };
};

﻿ContinuationModule.Policies.PayloadPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
﻿  console.log(continuationModule);
  this.matches = function (continuation) {
    return continuation.resultName != null;// && continuation.model != null;
  };
  this.execute = function (continuation) {
    this.continuationModule.eventAgreggator.publish(continuation.resultName, continuation);
  };
};

﻿ContinuationModule.Policies.RefreshPolicy = function (continuationModule) {
  this.continuationModule = continuationModule;
  this.matches = function (continuation) {
    return continuation.refresh && continuation.refresh.toString() === 'true';
  };
  this.execute = function (continuation) {
    this.continuationModule.windowService.refresh();
  };
};

﻿﻿(function ($, global) {
  global.ContinuationModule.ajaxJson = function (endpoint, payload) {
    return $.ajax({
      converters : {
        'text json': function (data) {
          return JSON.parse(data, function(key, value) {
            if (typeof value === 'string') {
                var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                if (a)
                    value = new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
            return value;
          });
        }
      },
      url: endpoint,
      type: 'POST',
      contentType: 'application/json',
      data: payload,
      dataType: 'json'
    });
  };
} (jQuery, this));

(function ($, global) {
  var aggregator = {
    publish: function (topic, payload) {
      $(window).trigger(topic, payload);
    },
    subscribe: function (topic, context, callback) {
      $(window).bind(topic, context, callback);
    }
  };

  global.Continuations = new ContinuationModule(aggregator, [
    ContinuationModule.Policies.PayloadPolicy,
    ContinuationModule.Policies.ErrorPolicy,
    ContinuationModule.Policies.NavigatePolicy,
    ContinuationModule.Policies.RefreshPolicy
  ]);
} (jQuery, this))