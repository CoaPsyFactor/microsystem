"use strict";
var BooleanTransformer = (function () {
    function BooleanTransformer() {
    }
    BooleanTransformer.prototype.getTransformed = function (input) {
        var cleanInput = input.toLowerCase();
        if (typeof input === 'string') {
            return 'false' === cleanInput ? false : 'true' === cleanInput;
        }
        return Boolean(input || false);
    };
    return BooleanTransformer;
}());
exports.BooleanTransformer = BooleanTransformer;
