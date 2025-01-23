import React, { useEffect, useState } from 'react';
import { apidelete, apigetdata, apipost, apiupdate } from '../api/Api';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
const Post = () => {
    const [data, setData] = useState([]); // Initialize as an empty array
    const [adddata,setadddata]=useState({
        
        Milk:"",
        Date:"",
    })  //state for data insertion
    const [updatedt,setupdatedt]=useState({});
    // displaying data method
    const getData = async () => {
        try {
            const response = await apigetdata();
            if (response?.data) {
                setData(response.data);
            } else {
                toast.error('API response does not contain data:', response);
                setData([]); // Fallback to an empty array
            }
        } catch (error) {
            toast.error('Error fetching data:', error);
            
            setData([]); // Handle errors by resetting the state
        }
    };
    //delete a data
    const handledelete=async(id)=>{
        try{
            const res=await apidelete(id);
            if(res.status===200){
                toast.success("Data deleted successfully");
                const updatedpost=data.filter((cure)=> cure.id!==id);
                setData(updatedpost);
            }else {
                toast.error("Failed to delete data",res.status);
                
            }

        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getData();
    }, []);
    //add data
    const handlechange=(e)=>{
        const { name, value } = e.target;
        setadddata((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const addtodata=async()=>{
        try{
            const newData = { ...adddata, id: adddata.id || uuidv4() };
            const res=await apipost(newData);
            if(res.status==201){
                toast.success("Data Added successfully");
                setData((prev)=>[...prev,res.data]);
                setadddata({id: "",Milk:"",Date:"",})
            }
        }catch(err){
            console.log(err);
        }
    }
    
    // Update data
    const handleupdate = (cur) => {
        setupdatedt(cur);
        setadddata({ Milk: cur.Milk, Date: cur.Date }); // Populate form with current data
    };

    const updatedata = async () => {
        try {
            const res = await apiupdate(updatedt.id, adddata);
            if (res.status === 200) {
                toast.success("Data updated successfully");
                setData((prev) =>
                    prev.map((curelem) =>
                        curelem.id === updatedt.id ? res.data : curelem
                    )
                );
            }
            setadddata({ Milk: "", Date: "" }); // Reset form
            setupdatedt({}); // Clear updated data
        } catch (err) {
            console.error(err);
        }
    };
    let isEmpty=Object.keys(updatedt).length===0;
    //add data
    
    const handlesubmit=(e)=>{
        e.preventDefault();
        if(!adddata.Milk || !adddata.Date){
            toast.warn("Both Fields are required");
            
            return;
        }
        const action = e.nativeEvent.submitter.value;
        if (action === "Add") {
            addtodata();
        }else if(action=="Update"){
            updatedata();
        }
        
    }
    return (
        <>
            <ToastContainer/>
            <div className="center-container">
                <h1>MRS Record System</h1>
                <form className="form" onSubmit={handlesubmit}>
                    <input type="text" placeholder="Milk" name="Milk" value={adddata.Milk} onChange={handlechange} />
                    <input type="date" placeholder="Date" name="Date" value={adddata.Date} onChange={handlechange}/>
                    <button type="submit" value={isEmpty ? 'Add' : 'Update'}>{isEmpty ? "Add" : "Update"}</button>
                </form>
                <table className="customers">
                    <thead>
                        <tr>
                            <th>Milk</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((cur,index) => (
                                <tr key={index}>
                                    <td>{cur?.Milk || 'N/A'}</td>
                                    <td>{cur?.Date || 'N/A'}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="delete-btn" onClick={()=>handledelete(cur.id)}>
                                                <MdDeleteForever size={20} />
                                            </button>
                                            <button className="edit-btn" onClick={()=>handleupdate(cur)}>
                                                <MdEdit size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No records available</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </>
    );
};

export default Post;
