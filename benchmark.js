let time = null;
const ROUNDS = 10000000;
const LEN = 10;

// test Array.from
time = new Date().getTime();
function testArrayFrom() {
    let p = [];
    p.push(...Array.from({ length: LEN }, () => []));
}
for (let i=0; i<ROUNDS; i++) {
    testArrayFrom();
}
console.log('Array.From used ' + (new Date().getTime() - time) + ' ms');

// test Array.Fill
time = new Date().getTime();
function testArrayFill() {
    let p = [];
    p.push(...new Array(LEN).fill([]));
}
for (let i=0; i<ROUNDS; i++) {
    testArrayFill();
}
console.log('Array.Fill used ' + (new Date().getTime() - time) + ' ms');

// test Generic Array method
time = new Date().getTime();
function testArrayGeneric() {
    let p = [];
    for (let i=0; i<LEN; i++) {
        p.push([]);
    }
}
for (let i=0; i<ROUNDS; i++) {
    testArrayGeneric();
}
console.log('Generic Array method used ' + (new Date().getTime() - time) + ' ms');