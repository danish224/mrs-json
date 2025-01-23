import axios from "axios";

const api=axios.create({
    baseURL:import.meta.env.VITE_PORT,
})

//getmethod
export const apigetdata=()=>{
    return api.get("/mrs")
}
//delete method
export const apidelete = (id) => {
    return api.delete(`/mrs/${id}`);
};
//post method
export const apipost = (data) => {
    return api.post("/mrs", data);
}
//update method
export const apiupdate=(id,data)=>{
    return api.put(`/mrs/${id}`,data)
}