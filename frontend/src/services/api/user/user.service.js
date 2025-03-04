import axios from "../../axios";

class UserService {
    async getUserSuggestions(){
        const response = await axios.get('/user/profile/users/suggestions');
        return response;
    }
}

export const userService = new UserService();