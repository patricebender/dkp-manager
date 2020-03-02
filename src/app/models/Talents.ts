import {PlayerClass} from './PlayerClass';

export function Talent(playerClass: PlayerClass) {
    switch (playerClass) {
        case PlayerClass.Druid:
            return ['Balance', 'Feral', 'Restoration'];
        case PlayerClass.Mage:
            return ['Arcane', 'Fire', 'Frost'];
        case PlayerClass.Hunter:
            return ['Beastmastery', 'Marksman', 'Survival'];
        case PlayerClass.Rogue:
            return ['Assassination', 'Combat', 'Subtlety'];
        case PlayerClass.Warrior:
            return ['Arms', 'Protection', 'Fury'];
        case PlayerClass.Priest:
            return ['Holy', 'Discipline', 'Shadow'];
        case PlayerClass.Shaman:
            return ['Elemental', 'Enhancement', 'Restoration'];
        case PlayerClass.Warlock:
            return ['Affliction', 'Destruction', 'Demonology'];
    }
}
