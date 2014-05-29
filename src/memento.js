
(function ($) {

	'use strict';

	var defaults = {
		val: function (value) {/*
			The getter/setter function for the input*/
			if (typeof value === 'undefined') {
				return this.val();
			}
			this.val(value);
			return value;
		},
		init: function (element, onupdate) {/*
			Bind the update listener to the element*/
			var evt;
			evt = element.tagName === 'SELECT' ? 'change' : 'input';
			$(element).on(evt, onupdate);
		}
	};

	// http://en.wikipedia.org/wiki/Memento_pattern
	function UndoRedoMemento (input) {
		var undo = [];
		var redo = [];
		var value = input();
		this.undo = function () {
			if (undo.length) {
				value = undo.pop();
				redo.push(input());
				input(value);
				return value;
			}
		};
		this.redo = function () {
			if (redo.length) {
				value = redo.pop();
				undo.push(input());
				input(value);
				return value;
			}
		};
		this.memento = function () {
			var newValue = input();
			if (value !== newValue) {
				undo.push(value);
				redo.length = 0;
				value = newValue;
			}
		};
	}

	function initialize(element, options) {
		var config, input, memento;
		config = $.extend({}, defaults, options || {});
		input = config.val.bind($(element));
		memento = new UndoRedoMemento(input);
		function update() {
			memento.memento();
		}
		config.init(element, update);
		$(element).data('memento', memento);
		return memento;
	}

	$.fn.memento = function (param) {
		var fn, options;
		if ('undo' === param) {
			fn = param;
		} else if ('redo' === param) {
			fn = param;
		} else if (typeof param === 'object') {
			options = param;
		}
		return this.each(function () {
			var memento = $(this).data('memento');
			if (!(memento instanceof UndoRedoMemento)) {
				memento = initialize(this, options);
			}
			if (fn) {
				memento[fn]();
			}
		});
	};

}(jQuery));
