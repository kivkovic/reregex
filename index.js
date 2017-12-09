'use strict';

class Gra {

	constructor(string) {
    	this.string = string;
    	this._escaped = null;
    	this._parentheses = null;
    	this._brackets = null;
	}

	get escaped () {
		if (this._escaped) {
			return this._escaped;
		}

		this._escaped = {};

		for (let i = 0, willEscape = false, quoted = false; i < this.string.length; i++) {
    		if (this.string[i] === '\\' && !willEscape) {
    			willEscape = true;

    		} else if (willEscape) {
    			willEscape = false;
    			this._escaped[i] = true;
    		}
    	}

    	return this._escaped;
	}

	get parentheses () {
		if (!this._parentheses) {
			this._parentheses = this.findBracketed({left: '(', right: ')', oneLevel: false}) || [];
		}

		return this._parentheses;
	}

	get brackets () {
		if (!this._brackets) {
			this._brackets = this.findBracketed({left: '[', right: ']', oneLevel: true}) || [];
		}

		return this._brackets;
	}

	findBracketed({left = '(', right = ')', oneLevel = false}) {

		const open = [], stack = [];

		for (let i = 0; i < this.string.length; i++) {
			if (this.string[i] === left && !this.escaped[i]) {
				open.push(new Gra.Range({from: i}));

			} else if (this.string[i] === right && !this.escaped[i]) {
				open[open.length-1].to = i + 1;
				stack.push(open.pop());
			}
		}

		stack.sort((a, b) => a.from - b.from);

		return stack.length
			? oneLevel
				? stack.filter(r => stack.filter(p => p.contains(r)).length === 1)
				: stack
			: false;
	}

    findTokens(token, filter, startOffset = 0) {

        const tokens = [];

		 if (token instanceof RegExp) {
        	let match;
    		while ((match = token.exec(this.string)) !== null) {
	        	if (!this.escaped[match.index]) {
	        		const range = new Gra.Range({from: match.index, to: match.index + match[0].length});
	        		if (filter(range)) {
			        	tokens.push(range);
			        }
		        }
	        }

    	 } else {

	 	    let index, offset = startOffset;
		    while ((index = this.string.indexOf(token, offset)) != -1){
		    	offset = index + token.length;
        		const range = new Gra.Range({from: index, to: index + token.length});
        		if (filter(range)) {
		        	tokens.push(range);
		        }
		    }
    	 }

        return tokens;
    }

    replace(range_s, string) {
    	const constructed = [], ranges = range_s.constructor === Array ? range_s : [range_s];
    	let last = 0;

    	for (let i = 0; i < ranges.length; i++) {
    		constructed.push(this.string.slice(last, ranges[i].from));
    		constructed.push(string);
    		last = ranges[i].to;
    	}

    	constructed.push(this.string.slice(last));

    	return new Gra(constructed.join(''))
    }
}

Gra.Range = class {
	constructor({from = -1, to = -1}) {
		this.from = from;
		this.to = to;
	}

	contains(range) {
		return (typeof range.from !== 'undefined' && typeof range.to !== 'undefined')
			? this.from <= range.from && this.to >= range.to
			: this.from <= range && this.to >= range;
	}

	isBracketed(brackets) {

		for (let i = 0; i < brackets.length; i++) {
			if (brackets[i].contains(this)) {
				return true;
			}
		}
		return false;
	}
}

class Rex {
	constructor(string, flags = 'g') {
		this._string = string;
		this.flags = flags;

		this.gra = new Gra(string);
		this.brackets = this.gra.brackets;

		this._locked = true;
	}

	get string () {
		return this._string;
	}

	set string (value) {
		if (this._locked) {
    		throw new ReferenceError(`Could not set read-only value`);
    	}
    	this._string = value;
	}

	findGroups() {
		if (this.groups) return this.groups;

		const
			notBracketed = t => !t.isBracketed(this.brackets),
			notSpecial = t => this.gra.string[t.from + 1] !== '?';

		this.groups = this.gra.parentheses
			.filter(notBracketed)
			.filter(notSpecial);

		if (this.groups[0].from !== 0 || this.groups[0].to != this.gra.string.length) {
			this.groups.unshift(new Gra.Range({from: 0, to: this.gra.string.length}));
		}

		return this.groups;
	}

	noncapturing() {

		Rex.noncapturingCache = Rex.noncapturingCache || {};
		if (Rex.noncapturingCache[this.string]) {
			return new Rex(Rex.noncapturingCache[this.string]);
		}

		this.groups = this.findGroups();
		let replaced = this.string, offset = 0;

		for (let i = 0; i < this.groups.length; i++) {
			if (replaced[this.groups[i].from + offset] === '(') {
				replaced = replaced.slice(0, this.groups[i].from + offset + 1) + '?:' + replaced.slice(this.groups[i].from + offset + 1);
				offset += 2;
			}
		}

		Rex.noncapturingCache[this.string] = replaced;
		return new Rex(replaced);
	}

	derecurse(n = 100) {

		const
			notBracketed = t => !t.isBracketed(this.brackets),
			groups = this.findGroups();

		let current = this.gra;

		for (let i = 0; i <= n; i++) {
			for (let j = 0; j < groups.length; j++) {
				let replacement;
				if (i < n) {
					replacement = `(?:${new Rex(this.gra.string.slice(groups[j].from, groups[j].to)).noncapturing().string})`;
				} else {
					replacement = '(?:$^)'
				}
				current = current.replace(current.findTokens(`(?${j})`, notBracketed), replacement)
			}
		}

		return new Rex(current.string);
	}
}

exports.Rex = Rex;