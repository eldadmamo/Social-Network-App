import axios from "../../axios";

class UserService {
    async getUserSuggestions(){
        const response = await axios.get('/user/profile/users/suggestions');
        return response;
    }

    async logoutUser(){
        const response = await axios.get('/signout');
        return response;
    }

    async checkCurrentUser(){
        const response = await axios.get('/currentuser');
        return response;
    }
}

export const userService = new UserService();