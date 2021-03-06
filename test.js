const ReRegex = require('./index.js').ReRegex;

class Test {

    constructor() {
        this.measure = {};
    }

    run({name, regex, expected, doesMatch = [], doesntMatch = [], derecurseLevel = 100}) {

        this.measure[name] = {};
        this.measure[name].start = +new Date;
        this.measure[name].compiletime = +new Date;

        const rex = new ReRegex(regex).derecurse(derecurseLevel);

        this.measure[name].compiletime = +new Date - this.measure[name].compiletime;

        if (expected && rex.string !== expected) {
            throw new Error(`Regression in test "${name}": unexpected compiled value`);
        }

        const compiled = rex.toRegExp('g', derecurseLevel);

        this.measure[name].runtime = +new Date;

        doesMatch.map(does => {
            let match;
            if (!(match = does.match(compiled)) || match[0].length != does.length) {
                throw new Error(`Regression in test "${name}": should match sample string "${does}"`);
            }
        });

        doesntMatch.map(doesnt => {
            let match;
            if ((match = doesnt.match(compiled)) && match[0].length === doesnt.length) {
                throw new Error(`Regression in test "${name}": should not match sample string "${doesnt}"`);
            }
        });

        this.measure[name].runtime = +new Date - this.measure[name].runtime;

        const byteSize = (s) => encodeURI(s).split(/%..|./).length - 1,
            size = byteSize(rex.string);

        this.measure[name].recursions = derecurseLevel;
        this.measure[name].size = size < 1024 ? `${size} B` : `${Math.round(size / 1024 * 100) / 100} kB`;
        this.measure[name].total = +new Date - this.measure[name].start;
    }

    report() {
        console.log(this.measure);
    }
}

const test = new Test();

test.run({
    name: 'linear_simple',
    regex: 'ab(c|d)de(f|(?0))g(h|i)h',
    expected: 'ab(c|d)de(f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|(?:ab(?:c|d)de(?:f|R^)g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(?:h|i)h))g(h|i)h',
    doesMatch: ['abcdefghh', 'abddefgih', 'abcdeabddefgihghh'],
    derecurseLevel: 256
});

// @todo: fix expression
/*test.run({
    name: 'html',
    regex: '(<(([^<>\\s]+)\\s*([^<>\\s"=]+(="((\\\\\\\\)*\\\\"|[^\\\\"]|\\\\[^"])*")?\\s*)*)(\\/|>([^<>]|(?0))*<\\/(\\3))>|<!--((?!-->).)*-->)',
    doesMatch: ['<a href="a\aa\\\"ab" class="dsdsd1">a<b>c</b>a<br/></a>', '<!-- aaa <br/> -->'],
    doesntMatch: ['<a>a>aa</a>', '<a href="aa"bb">c</a>', '<!-- --> -->'],
    derecurseLevel: 1
})*/

test.run({
    name: 'space_polynomial',
    regex: 'ab(c|(?2))de(f|(?1))g(?0)h',
    derecurseLevel: 50
});

test.run({
    name: 'space_time_exponential',
    regex: 'ab(c|(?2))de(f|(?0))g(?1)h',
    derecurseLevel: 10
});

test.report();
