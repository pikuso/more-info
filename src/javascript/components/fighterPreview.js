import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

function createFighterInfo(fighter) {
    const infoElement = createElement({
        tagName: 'div',
        className: 'fighter-preview___info'
    });

    const imageElement = createFighterImage(fighter);

    const keys = ['name', 'health', 'attack', 'defense'];
    const fighterDetailes = keys.map(key => {
        const detailElement = createElement({
            tagName: 'div',
            className: 'fighter-preview___info'
        });
        const value = fighter[key];
        const line = `${key[0].toUpperCase()}${key.slice(1)}: ${value}`;
        detailElement.innerText = line;
        return detailElement;
    });

    infoElement.append(imageElement, ...fighterDetailes);

    return infoElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';

    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const fighterInfo = createFighterInfo(fighter);
        fighterElement.appendChild(fighterInfo);
    }

    return fighterElement;
}
