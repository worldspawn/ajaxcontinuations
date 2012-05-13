/*
$.continuations = new $.continuationModule(eventAgreggrator, [
  jQuery.continuationModule.Policies.PayloadPolicy,
  jQuery.continuationModule.Policies.ErrorPolicy,
  jQuery.continuationModule.Policies.NavigatePolicy,
  jQuery.continuationModule.Policies.RefreshPolicy
])
*/

(function ($) {
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
        self.eventAggregator.publish('AjaxCompleted', {
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
          self.setupRequest(xhr)
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
      this.eventAggregator.publish('AjaxStarted', {
        correlationId: id,
        xhr: xhr
      });
    },
    applyPolicy: function (policy) {
      policies.push(policy);
      return this;
    },
    process: function (continuation) {
      continuation = $.extend(new AjaxContinuation(), continuation);
      var matchingPolicies = [];
      for (var i = 0; i < policies.length; ++i) {
        var p = policies[i];
        if (p.matches(continuation)) {
          matchingPolicies.push(p);
        }
      }

      for (var i = 0; i < matchingPolicies.length; ++i) {
        matchingPolicies[i].execute(continuation);
      }
    }
  }

  ContinuationModule.Policies = {};
  window.ContinuationModule = ContinuationModule;
} (jQuery))