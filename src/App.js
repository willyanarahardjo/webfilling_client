import "./App.css";
import List from "./List";
import { useState, useEffect } from "react";
import { uid } from "uid";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);

  const [formData, setFormData] = useState(
    {
      name: "",
      phone: "",
    }
  );

  const [isUpdate, setIsUpdate] = useState({
    id: null,
    status: false,
  });

  useEffect(()=> {
    //mengambil data
    axios.get('https://jsonplaceholder.typicode.com/users').then(res => {
      console.log(res.data);
      setContacts(res?.data ?? []);
    });
  }, [])

  function handleChange (e) {
    let data = {...formData};
    data[e.target.name] = e.target.value;
    setFormData(data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let data = [...contacts];

    if (formData.name === "" || formData.phone === "") {
      return alert("data tdk lengkap");
    }

    if (isUpdate.status) {
      data.forEach((contact)=> {
        if(contact.id === isUpdate.id) {
          contact.name = formData.name;
          contact.phone = formData.phone;
        }

      let updatedData = {id: uid(), name:formData.name, phone: formData.phone}

      axios.put(`https://jsonplaceholder.typicode.com/users/${isUpdate.id}`,updatedData).then(res => {
        alert("Berhasil update data")
      })

      });

    } else {
      let newData = {id: uid(), name:formData.name, phone: formData.phone}
      data.push(newData);

      axios.post('https://my-json-server.typicode.com/typicode/demo/profile', newData).then(res => {
        alert("Berhasil Menyimpan Data");
      })
    }

    //push
    setIsUpdate({id: null, status: false});
    setContacts(data);
    setFormData({name:"", phone:""});
  }

  function handleEdit(id) {
    let data=[...contacts];
    let foundData = data.find((contact)=> contact.id === id);
    setFormData({name: foundData.name, phone: foundData.phone});
    setIsUpdate({id: id, status: true});
  }

  function handleDelete(id) {
    let data = [...contacts];
    let filteredData = data.filter((contact)=> contact.id !== id);

    setContacts(filteredData);
    
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`,filteredData).then(res => {
      alert("Berhasil menghapus data");
    });
  }

  return (
    <div className="App">
      <h1 className="px-3 py-3">My Contact List</h1>

      <form onSubmit={handleSubmit} className="px-3 py-4">
        <div className="form-group">
          <label htmlFor="">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.name}
            name="name" />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">No. Telp</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.phone}
            name="phone" />
        </div>
        <div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Save
          </button>
        </div>
      </form>

      <List 
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        data={contacts} />
    </div>
  );
}

export default App;
