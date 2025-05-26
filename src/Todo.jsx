import {useState,useEffect} from 'react'
export default function Todo() {
    const [title,setTitle]=useState("");
    const [desc,setDesc]=useState("");
    const [todos,setTodos]=useState([]);
    const [error,setError]=useState("");
    const [msg,setMsg]=useState("");
    const [editId,setEditId]=useState(-1);
    //Edit Route
        const [editTitle,seteditTitle]=useState("");
    const [editDesc,seteditDesc]=useState("");
    const apiUrl="http://localhost:8000"
    const handleSubmit=()=>{
        //Check Inputs
        setError("")
// Check Inputs
if (title.trim() !== "" && desc.trim() !== "") {
    fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, desc })
    }).then((res)=>{
        if(res.ok){
                setTodos([...todos, { title, desc }]);
                setMsg("Item Added Succesfully")
                setTitle("")
                setDesc("")
                setTimeout(()=>{
                    setMsg("");
                },3000);
        }else{
            setError("Unable to create Todo item ")

        }
    }).catch(()=>{
        setError("Unable to create and Todo")
                    setTimeout(()=>{
                setError("");
            },3000);
    });

}
    }
    useEffect(()=>{
    getItems()
},[]);
    const getItems = ()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>{
            return res.json()
        })
        .then((res)=>{
            setTodos(res);
        })
    }
    const handleEdit=(item)=>{
        setEditId(item._id);
        seteditTitle(item.title ||"");
        seteditDesc(item.desc ||"");
    }
    const handleEditCancel=()=>{
        setEditId(-1);

    }
    const handleDelete=(id)=>{
        if(window.confirm('Are you sure want to Delete?')){
            fetch(
                apiUrl+'/todos/'+id,{
                    method:"DELETE"
                }
            ).then(()=>{
                const updatedTodos=todos.filter((item)=>item._id!==id)
                setTodos(updatedTodos)
            })

        }

    }
const handleUpdate=()=>{

        setError("")
// Check Inputs
if (editTitle?.trim() !== "" && editDesc?.trim() !== "") {
    fetch(apiUrl + "/todos/"+editId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title:editTitle, desc:editDesc })
    }).then((res)=>{
        if(res.ok){
           const updatedTodos =todos.map((item)=>{
                if(item._id===editId){
                    item.title=editTitle;
                    item.desc=editDesc;
                }
                return item;
            })
                setTodos(updatedTodos);
                setMsg("Item Updateded Succesfully")
                setTimeout(()=>{
                    setMsg("");
                },3000);
                setEditId(-1);
        }else{
            setError("Unable to create Todo item ")

        }
    }).catch(()=>{
        setError("Unable to create and Todo")
                    setTimeout(()=>{
                setError("");
            },3000);
    });

}

}
    return <><div className="row p-3 bg-success text-light">

        <h1>Todo List using Mern</h1>
    </div>
    <div className="row">
        <h3>Add Item</h3>
        {msg && <p className="text-success">{msg}</p>}
    </div>
    <div className='form-group d-flex gap-2'>
        <input className='form-control' type="text"placeholder="Enter the Exciting Task"value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <input className='form-control' type="text"placeholder="Enter the Description " value={desc} onChange={(e)=>setDesc(e.target.value)}/>
        <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
        {error &&<p className='text-danger'>{error}</p>}
         </div>
         <div className="row mt-3">
            <h3>Tasks</h3>
            <ul className="list-group">
                {
                    todos.map((item,index)=>{
                        return(
                <li key={index} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                  <div className="d-flex flex-column me-2">
                    {
                        editId===-1 || editId!== item._id?<>
                        <span className="fw-bold">{item.title}</span>
                        <span >{item.desc}</span>
                        </>:<>

                             <div className='from-group d-flex gap-2'>
        <input className='form-control' type="text"placeholder="Enter the Exciting Task"value={editTitle} onChange={(e)=>seteditTitle(e.target.value)}/>
        <input className='form-control' type="text"placeholder="Enter the Description " value={editDesc} onChange={(e)=>seteditDesc(e.target.value)}/>

         </div>
                                 </>
                    }

                    </div>
                    <div className="d-flex gap-2">
                   {editId===-1|| editId!==item._id ? <button className='btn btn-warning'onClick={()=>handleEdit(item)}>Edit</button>:<button onClick={handleUpdate}>Update</button>}
                    {editId===-1 ?<button className='btn btn-danger' onClick={()=>handleDelete(item._id)}>Delete</button>:
                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
                     </div>
                </li>)
                    })
                }

            </ul>
         </div>
    </>
}

