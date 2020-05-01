getRandomStats('common');

function getRandomStats(rarity) {
    let manaAverage;
    let strength;
    switch (rarity) {
        case 'common':
            strength = 2;
            manaAverage = 3;
            break;
        case 'rare':
            strength = 2.25;
            manaAverage = 6;
            break;
        case 'epic':
            strength = 2.5;
            manaAverage = 10;
            break;
        case 'legendary':
            strength = 2.75;
            manaAverage = 15;
            break;
        default:
            throw Error('invalid rarity');
    }
    let mana;
    do {
        mana = Math.round(normalDistribution(manaAverage));
    } while (mana >= 20);
    const denom = strength * mana;
    let off;
    do {
        off = Math.round(normalDistribution(denom * 0.4));
    } while (off * 1.5 >= denom);
    let def;
    do {
        def = Math.round(normalDistribution(off * 0.5));
    } while (off + def >= denom || def >= off);
    const health = Math.round(denom - off - def);
    console.log('strength: ' + ((off + def + health) / mana));
    console.table({
        mana: mana,
        offense: off,
        defense: def,
        health: health,
    });
    return {
        mana: mana,
        offense: off,
        defense: def,
        health: health,
    };
}

function normalDistribution(value) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return normalDistribution(value); // resample between 0 and 1
    return num * 2 * value;
}