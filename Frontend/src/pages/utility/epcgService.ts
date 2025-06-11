import axios from "axios";
import { BACKEND_URL } from "../../Globle";

export async function fetchEpcgLicenseBySrNo(token: string, srNo: string) {
    try {
        const res = await axios.get(`${BACKEND_URL}/documentslist/epcglicense`, {
            params: { srNo },
            headers: {
                Authorization: token,
            },
        });
        
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            alert("Token Expired");
            localStorage.removeItem("token");
            window.location.reload();
        } else if (error.response?.status === 404) {
            return { message: "EPCG License not found", data: null };
        } else {
            alert("Something went wrong");
            console.log(error.response?.data);
        }
        return { message: "Error fetching data", data: null };
    }
}

