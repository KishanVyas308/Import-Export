import axios from "axios";
import { BACKEND_URL } from "../../Globle";

export async function fetchCustomers(token: string) {
    try {
        const res = await axios.get(`${BACKEND_URL}/getdata/allexpoters`, {
          headers: {
            Authorization: token,
          },
        });
        
        return res.data;
    } catch (error : any) {
        if(error.response.status === 401){
            alert("Token Expired");
            localStorage.removeItem("token");
            window.location.reload();
        }
        else {
            alert("Something went wrong");
            console.log(error.response.data);
        }
        console.log(error.response.data);
        return [];
    }
}
