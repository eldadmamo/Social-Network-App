import { floor, random } from 'lodash';
import { avatarColors } from './static.data';
import { addUser, clearUser } from '../../redux-toolkit/reducers/user/user.reducer';

export class Utils {
    static avatarColor() {
        return avatarColors[floor(random(0.9) * avatarColors.length)];
    }

    static generateAvatar(text, backgroundColor, foregroundColor = 'white') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = 200;
        canvas.height = 200;

        context.fillStyle = backgroundColor;
        context.fillRect(0,0,canvas.width, canvas.height);

        // Draw text
        context.font = 'normal 80px sans-serif';
        context.fillStyle = foregroundColor;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL('image/png');
    }

    static dispatchUser(result, pageReload, dispatch, setUser){
        pageReload(true);
        dispatch(addUser({token: result.data.token, profile: result.data.user}))
        setUser(result.data.user);
    }

    static clearStore({dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn}){
        dispatch(clearUser());
        // dispatch clear notification action
        deleteStorageUsername();
        deleteSessionPageReload();
        setLoggedIn(false);
    }

     static appEnviroment() {
        const env = import.meta.env.VITE_REACT_APP_ENVIROMENT;
        if(env === 'development'){
            return 'DEV'
        } else if (env === 'staging'){
            return 'STG'
        }
     }

     static mapSettingsDropdownItems(setSettings){
        const items = []
        const item = {
            topText: 'My Profle',
            subText: 'View personal Profile'
        };
        items.push(item)
        setSettings(items);
        return items;
     }
}
