﻿(function ($, global) {
  $.fn.ajaxJson = function (endpoint, payload) {
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
}(jQuery, this));
