import controls from '../../constants/controls';

const availableKeys = Object.values(controls).reduce((acc, item) => {
    if (Array.isArray(item)) item.forEach(x => acc.add(x));
    else acc.add(item);

    return acc;
}, new Set());

const pressedKeys = new Set();

const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
};

export function getHitPower(fighter) {
    // return hit power
    const criticalHitChance = getRandomFloat(1, 2);
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    // return block power
    const dodgeChance = getRandomFloat(1, 2);
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    // return damage
    const hit = getHitPower(attacker);
    const block = getBlockPower(defender);
    return Math.max(hit - block, 0);
}

function win(winner) {
    const event = new CustomEvent('win', {
        detail: { winner },
        bubbles: false,
        cancelable: true,
        composed: false
    });
    document.dispatchEvent(event);
}

const onKeydownHandler = (firstFighter, secondFighter) => {
    let firstHealth = firstFighter.health;
    let secondHealth = secondFighter.health;

    const firstHealthBar = document.getElementById('left-fighter-indicator');
    const secondHealthBar = document.getElementById('right-fighter-indicator');

    let firstSuperHitWasRecently = false;
    let secondSuperHitWasRecently = false;

    const canAttack = () => !pressedKeys.has(controls.PlayerOneBlock) && !pressedKeys.has(controls.PlayerTwoBlock);

    const isFirstHit = () => pressedKeys.has(controls.PlayerOneAttack);

    const isSecondHit = () => pressedKeys.has(controls.PlayerTwoAttack);

    const isFirstSuperHit = () =>
        !firstSuperHitWasRecently && controls.PlayerOneCriticalHitCombination.every(key => pressedKeys.has(key));

    const isSecondSuperHit = () =>
        !secondSuperHitWasRecently && controls.PlayerTwoCriticalHitCombination.every(key => pressedKeys.has(key));

    const firstHit = () => {
        const damage = getDamage(firstFighter, secondFighter);
        secondHealth = Math.max(secondHealth - damage, 0);
    };

    const secondHit = () => {
        const damage = getDamage(secondFighter, firstFighter);
        firstHealth = Math.max(firstHealth - damage, 0);
    };

    const firstSuperHit = () => {
        const damage = 2 * firstFighter.attack;
        secondHealth = Math.max(secondHealth - damage, 0);

        firstSuperHitWasRecently = true;
        setTimeout(() => {
            firstSuperHitWasRecently = false;
        }, 1e4);
    };

    const secondSuperHit = () => {
        const damage = 2 * secondFighter.attack;
        firstHealth = Math.max(firstHealth - damage, 0);

        secondSuperHitWasRecently = true;
        setTimeout(() => {
            secondSuperHitWasRecently = false;
        }, 1e4);
    };

    return ({ code }) => {
        if (!availableKeys.has(code)) return;
        pressedKeys.add(code);

        if (!canAttack()) return;
        if (isFirstHit()) firstHit();
        if (isSecondHit()) secondHit();
        if (isFirstSuperHit()) firstSuperHit();
        if (isSecondSuperHit()) secondSuperHit();

        firstHealthBar.style.width = `${(firstHealth / firstFighter.health) * 100}%`;
        secondHealthBar.style.width = `${(secondHealth / secondFighter.health) * 100}%`;

        if (firstHealth === 0) win(secondFighter);
        if (secondHealth === 0) win(firstFighter);
    };
};

const onKeyupHandler = ({ code }) => {
    pressedKeys.delete(code);
};

export async function fight(firstFighter, secondFighter) {
    const keydown = onKeydownHandler(firstFighter, secondFighter);
    document.addEventListener('keydown', keydown);

    document.addEventListener('keyup', onKeyupHandler);

    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        const onWinHandler = event => {
            document.removeEventListener('keydown', keydown);
            document.removeEventListener('keyup', onKeyupHandler);
            document.removeEventListener('win', onWinHandler);
            pressedKeys.clear();

            resolve(event.detail.winner);
        };

        document.addEventListener('win', onWinHandler);
    });
}
