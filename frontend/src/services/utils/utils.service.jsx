import { floor, random } from 'lodash';
import { avatarColors } from './static.data';

export class Utils {
    static avatarColor() {
        return avatarColors[floor(random() * avatarColors.length)];
    }
}
