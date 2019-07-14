import React, { useState, useEffect, useRef } from 'react';
import FileComponent from './FileComponent';

function MainPage() {

    const [users, setUsers] = useState([])
    const [user, setUser] = useState(null)
    const [usersFiles, setUsersFiles] = useState([])
    const inputFileEl = useRef()

    useEffect(() => {
        // Load users
        fetch('/api/users/all')
        .then(res => res.json())
        .then(res => setUsers(res))

        // Load all files
        fetch('/api/files/all')
        .then(res => res.json())
        .then(res => setUsersFiles(res))

    }, [])

    useEffect(() => {
        if(users.length) {
            setUser(users[0])
        }
    }, [users])

    function switchUser() {
        const newUser = user.id === users[0].id ? users[1] : users[0];
        setUser(newUser)
    }

    function onChange(e) {
        const files = e.target.files
        const file = files[0]

        let isPrivate = window.confirm("Do you want file permission to be private ?");

        const formData = new FormData()
        formData.append("file", file)
        formData.append("userId", user.id)
        formData.append("isPrivate", isPrivate)
    
        fetch('/api/files/upload', {
          method: 'POST',
          contentType: 'multipart/form-data',
          body: formData
        })
        .then(res => res.json())
        .then(file => {
            const oldFile = usersFiles.find(userFile => userFile.id === file.id)
            if(!oldFile) {
                setUsersFiles([...usersFiles, file])
            } else {
                setUpdatedFile(file)
            }
            inputFileEl.current.value = ""
        }).catch(err => {
            console.log(err)
        })
      }

      function setUpdatedFile(file) {
          const fileIndex = usersFiles.findIndex(userFile => userFile.id === file.id)
        let filesCopy = usersFiles.map(userFile => ({...userFile}))
        filesCopy[fileIndex] = file

        setUsersFiles(filesCopy)
      }

     

      

  return (
    <div>
        <div>
            <h2>{`User ${user && user.name} has connected, you can swith user here`}</h2>
            <button onClick={switchUser}>Switch User</button>
            <div>
                <span>Upload file as {user && user.name}</span>
                <input type='file' name='file' id='upload' onChange={onChange} ref={inputFileEl} /> 
            </div>
            
        </div>

      <div>
          <span>All files</span>
            <div className="allFiles">
                {
                    usersFiles.map((file, i) => (
                        user && file && <FileComponent 
                            key={file.id} 
                            file={file} 
                            users={users}
                            userId={user.id} 
                            setUpdatedFile={setUpdatedFile}/>
                    ))
                }
            </div>
      </div>
    </div>
  );
}

export default MainPage;
