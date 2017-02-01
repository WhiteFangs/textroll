var textroll = (function () {

	var _defaults = {
		interval: 100,
		progressive : false,
		alphabet : 'abcdefghijklmnopqrstuvwxyz'.split(''),
		numbers : '0123456789'.split(''),
		punctuation: '"\'(-),?;.:!'.split(''),
		specials: '&#~{[|`_\\^@]=}+°<>/§*%¨$£¤'.split(''),
		spaceCorpus : "alphabet",
		changeCase: "end"
	}

	var _options;

	function init(options){
		_options = {};
		options = options || {};
		// build options with corpora first
		_options.alphabet = options.alphabet != undefined ? options.alphabet : _defaults.alphabet;
		_options.numbers = options.numbers != undefined ? options.numbers : _defaults.numbers;
		_options.punctuation = options.punctuation != undefined ? options.punctuation : _defaults.punctuation;
		_options.specials = options.specials != undefined ? options.specials : _defaults.specials;
		// add other corpora
		var newCorpora = options.addCorpora;
		for (var k in newCorpora){
			if (newCorpora.hasOwnProperty(k) && _options[k] == undefined) {
				_options[k] = newCorpora[k].split('');
			}
		}
		// add space to corresponding corpora
		if(options.spaceCorpus != undefined && _options[options.spaceCorpus] != undefined){
			_options[options.spaceCorpus] = (' ' + _options[options.spaceCorpus].join('')).split('')
		}else{
			_options[_defaults.spaceCorpus] = (' ' + _options[_defaults.spaceCorpus].join('')).split('')
		}
		// build corpora
		_options.corpora = [];
		for (var k in _options){
			if (_options.hasOwnProperty(k) && k != "corpora") {
				_options.corpora.push(_options[k]);
			}
		}
		// add other variables to _options
		_options.interval = options.interval != undefined ? options.interval : _defaults.interval;
		_options.progressive = options.progressive != undefined ? options.progressive : _defaults.progressive;
		_options.changeCaseAtEnd = options.changeCase == "beginning" ? false : options.changeCase == "end" ? true : _defaults.changeCase == "end";
	}		
	
	function sansAccents(s) {
		var r = s.toLowerCase();
		r = r.replace(/[àáâãäå]/g, "a");
		r = r.replace(/[èéêë]/g, "e");
		r = r.replace(/[ìíîï]/g, "i");
		r = r.replace(/[òóôõö]/g, "o");
		r = r.replace(/[ùúûüµ]/g, "u");
		r = r.replace(/[ýÿ]/g, "y");
		return r;
	};

	function isCapital(letter){
		return _options.alphabet.indexOf(letter.toLowerCase()) > 0 && letter.toUpperCase() == letter; // space is not cap
	}

	function replaceCharAt(word, i, newChar){
		return word.slice(0, i) + newChar + word.slice(i+1, word.length);
	}

	function getCorpus(character){
		var i = 0, idx = -1, corpus;
		while(idx < 0 && i < _options.corpora.length){
			corpus = _options.corpora[i];
			idx = corpus.indexOf(character);
			i++;
		}
		return corpus;
	}

	function replaceText (element, newText){
		var oldText = element.innerText;
		var iteration = 0;
		var interval = setInterval(function (){
			if( oldText == newText || oldText.toLowerCase() == sansAccents(newText)){
				element.innerText = newText;
				clearInterval(interval);
				return;
			}else{
				oldText = getNextText(oldText, newText, iteration);
				if(oldText.length > newText.length && (!_options.progressive || iteration > oldText.length))
					oldText = oldText.slice(0, oldText.length - 1);
				element.innerText = oldText;
				iteration++;
			}
		}, _options.interval);
	}

	function getNextText(oldText, newText, iteration){
		var stop = newText.length;
		if(_options.progressive)
			stop = Math.min(iteration, stop);
		for(var i =0; i < stop; i++){
			var oldChar = oldText[i];
			var newChar = newText[i];
			if(oldChar == newChar)
				continue;

			var isNewCap = isCapital(newChar);
			newChar = sansAccents(newChar);
			var newCorpus = getCorpus(newChar);
			if(newCorpus.indexOf(newChar) < 0) // if character is unknown
				newCorpus = [newChar];
			
			if(oldChar == undefined){ // newText is longer, so we finish this round by adding newChar at the end of oldText
				oldText += newCorpus[0];
				i = newText.length;
				continue;
			}

			var isOldCap = isCapital(oldChar);
			oldChar = sansAccents(oldChar);
			if(newChar == oldChar){
				oldText = isNewCap ? replaceCharAt(oldText, i, newChar.toUpperCase()) : replaceCharAt(oldText, i, newChar);
			}else{
				var oldCorpus = getCorpus(oldChar);
				var nextChar;
				var oldIdx = oldCorpus.indexOf(oldChar);
				if(oldIdx < 0){
					nextChar = newCorpus[0];
				}else if(newCorpus == oldCorpus){
					nextChar = oldCorpus[(oldIdx + 1) % oldCorpus.length];
				}else if(oldIdx == oldCorpus.length - 1){
					nextChar = newCorpus[0];
				}else{
					nextChar = oldCorpus[oldIdx + 1];
				}
				if((_options.changeCaseAtEnd && isOldCap) || (!_options.changeCaseAtEnd && isNewCap))
					nextChar = nextChar.toUpperCase();

				oldText = replaceCharAt(oldText, i, nextChar);
			}
		}
		return oldText;
	}

	return {
		init: init,
		replace : replaceText
	};
})();

textroll.init();