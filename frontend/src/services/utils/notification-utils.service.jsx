import { socketService } from './../socket/socket.service';
import { cloneDeep, find, findIndex, remove } from 'lodash';

export class NotificaitonUtils {


static socketIONotification(profile, notifications, setNotifications, type, setNotificationsCount){
        socketService?.socket?.on('insert notification',(data, userToData) => {
            if(profile?._id === userData.userTo){
                notifications = [...data];
                if(type === 'notificationPage'){
                    setNotifications(notifications);
                }
            }
        });
        socketService?.socket?.on('update notification',(notificationId) => {
            notifications = cloneDeep(notifications);
            const notificationData = find(notifications, (notification) => notification._id === notificationId);
            if(notificationData){
                const index = findIndex(notifications, (notification) => notification._id === notificationId);
                notificationData.read = true;
                notifications.splice(index, 1, notificationData);
                if(type === 'notificationPage'){

                }
            }
        });
        socketService?.socket?.on('delete notification',(notificationId) => {
            notifications = cloneDeep(notifications);
            remove(notifications, {_id: notificationId});
            if(type === 'notificationPage'){
                setNotifications(notifications);
            }
        });
    }
}