# Textroll

Textroll is a small javascript module to animate text replacement with a rolling effect for each character.

The characters "roll" through the set of characters they belong to until they reach the character by which they are replaced in the new text.

## Example

An image is worth a thousands words, so a gif probably does worth more:

![](./images/example.gif)

The transition works especially well on replacement of text with the same beginning:

![](./images/interesting.gif)

The 'progressive' option allows you to make a train-station-board-like effect on the text change:

![](./images/progressive.gif)

## Install

Simply add the textroll.js script file to your page

```html
<script src="./textroll.js"></script>

```

## Options

You can initialize textroll with options, here are the default values for the available options:

```javascript

var defaultOptions = {
	'interval' : 100, // milliseconds between each iterations of replacement
	'progressive' : false, // if true, character replacement expands with time from first character to whole text
	'alphabet' : 'abcdefghijklmnopqrstuvwxyz', // string of successive characters to add
	'numbers' : '0123456789', // string of successive characters to add
	'punctuation' : '"\'(-),?;.:!', // string of successive characters to add
	'specials' : '&#~{[|`_\\^@]=}+°<>/§*%¨$£¤', // string of successive characters to add
	'addCorpora' : {'corpusName' : ''}, // add new corpus, object with key: corpus name, value: strings of successive characters,
	'spaceCorpus' : 'alphabet', // string defining which corpus contains space character
	'changeCase' : 'end' // 'beginning' or 'end' for applying case change
}

// use init to override default options with your own
textroll.init({
	'interval' : 500, 
	'progressive' : true,
	'spaceCorpus' : 'punctuation',
	'addCorpora': {'cedilla' : 'çş'}
	'changeCase' : 'beginning'
});

```