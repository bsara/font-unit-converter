String.EMPTY = "";


$(function() {
  var invalidCSSClassName = 'invalid';
  var pinnedCSSClassName = 'js-pinned';


  var ptPerPx = 0.75;
  var pxPerPt = (4 / 3);


  var convertFromValueElement = $('#convertFromValue');
  var convertFromUnitElement = $('#convertFromUnit');
  var emBaseValueElement = $('#emBaseValue');
  var emBaseUnitElement = $('#emBaseUnit');
  var resultsListElement = $('#results');


  var pinResult = function(event) {
    event.target.parent().parent().addClass(pinnedCSSClassName);
  };

  var unpinResult = function(event) {
    event.target.parent().parent().removeClass(pinnedCSSClassName);
  };

  var clearUnpinnedResults = function() {
    resultsListElement.children().remove('li:not(.' + pinnedCSSClassName + ')');
  };


  var isEmptyValue = function(value) {
    return ((value !== 0) && (!value || !value.trim()));
  };

  var validate = function(target) {
    if (!target.checkValidity()) {
      $(target).addClass(invalidCSSClassName);
      return false;
    }
    $(target).removeClass(invalidCSSClassName);


    if (target.id === emBaseValueElement.id) {
      return true;
    }


    var emBaseValue = emBaseValueElement.val();

    if (convertFromUnitElement.val() === 'em' &&
          (!emBaseValueElement[0].checkValidity() || isEmptyValue(emBaseValue))) {
      emBaseValueElement.addClass(invalidCSSClassName);
      return false;
    }
    emBaseValueElement.removeClass(invalidCSSClassName);


    return !isEmptyValue(convertFromValueElement.val());
  };


  var ptToPx = function(ptValue) {
    return (ptValue * pxPerPt);
  };

  var pxToPt = function(pxValue) {
    return (pxValue * ptPerPx);
  };

  var toEm = function(value, emBase) {
    return (value / emBase);
  };

  var fromEm = function(emValue, emBase) {
    return (emValue * emBase);
  };

  var convert = function(event) {
    if (!validate(event.target)) {
      return;
    }


    var convertFromValue = convertFromValueElement.val();
    var convertFromUnit = convertFromUnitElement.val();
    var emBaseValue = emBaseValueElement.val();
    var emBaseUnit = emBaseUnitElement.val();

    var emValue = null;
    var ptValue;
    var pxValue;


    if (convertFromUnit === 'em') {
      emValue = convertFromValue;
      ptValue = fromEm(convertFromValue, ((emBaseUnit === 'pt') ? emBaseValue : pxToPt(emBaseValue)));
      pxValue = fromEm(convertFromValue, ((emBaseUnit === 'px') ? emBaseValue : ptToPx(emBaseValue)));
    } else {
      ptValue = ((convertFromUnit === 'pt') ? convertFromValue : pxToPt(convertFromValue));
      pxValue = ((convertFromUnit === 'px') ? convertFromValue : ptToPx(convertFromValue));

      if (!emValue && emBaseValue && emBaseValue.trim()) {
        var emBaseValueTemp = emBaseValue;

        if (convertFromUnit === 'pt' && emBaseUnit === 'px') {
          emBaseValueTemp = pxToPt(emBaseValue);
        } else if (convertFromUnit === 'px' && emBaseUnit === 'pt') {
          emBaseValueTemp = ptToPx(emBaseValue);
        }

        emValue = toEm(convertFromValue, emBaseValueTemp);
      }
    }


    var resultHTML = '<li>';
    resultHTML += '<div class="heading">' + convertFromValue + convertFromUnit;

    if (convertFromUnit === 'em') {
      resultHTML += ' with EM base of ' + emBaseValue + emBaseUnit;
    }

    resultHTML += ' converts to...<button class="pinButton">Pin</button></div>';

    if (emValue) {
      resultHTML += '<div class="emLine">' + emValue + 'em (Base: ' + emBaseValue + emBaseUnit + ')</div>';
    }

    resultHTML += '<div class="ptLine">' + ptValue + 'pt</div>';
    resultHTML += '<div class="pxLine">' + pxValue + 'px</div>';
    resultHTML += '</li>';


    clearUnpinnedResults();


    resultsListElement.prepend(resultHTML);



  };


  convertFromValueElement.on('change', convert);
  convertFromValueElement.on('keyup', convert);
  convertFromUnitElement.on('change', convert);
  emBaseValueElement.on('change', convert);
  emBaseValueElement.on('keyup', convert);
  emBaseUnitElement.on('change', convert);
});
