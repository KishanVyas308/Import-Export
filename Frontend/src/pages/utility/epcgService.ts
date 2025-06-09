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

export async function saveEpcgLicenseData(token: string, data: any) {
    try {
        const res = await axios.post(`${BACKEND_URL}/documentslist/epcglicense`, data, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        });
        
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            alert("Token Expired");
            localStorage.removeItem("token");
            window.location.reload();
        } else {
            alert("Error saving EPCG License data");
            console.error("Save error:", error.response?.data);
        }
        throw error;
    }
}

export async function updateEpcgLicenseData(token: string, srNo: string, data: any) {
    try {
        const res = await axios.put(`${BACKEND_URL}/documentslist/epcglicense`, 
            { ...data, srNo },
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            alert("Token Expired");
            localStorage.removeItem("token");
            window.location.reload();
        } else {
            alert("Error updating EPCG License data");
            console.error("Update error:", error.response?.data);
        }
        throw error;
    }
}
