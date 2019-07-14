import React from 'react'
import { saveAs } from 'file-saver'
import handleErrors from '../errorHandling'

function FileComponent(props) {
  const { file, userId, setUpdatedFile, users } = props

  async function download() {
    fetch(`/api/files/download?userId=${file.userId}&filename=${file.filename}&accessToken=${getAccessToken()}`)
      .then(handleErrors)
      .then(res => {
        return res.blob()
      })
      .then(async blob => {
        await saveAs(blob, file.filename)
      })
      .catch(err => {
        alert(err)
      })
  }

  async function getMetadata() {
    fetch(`/api/files/download?userId=${file.userId}&filename=${file.filename}&accessToken=${file.accessToken}&metadata=${true}`)
      .then(handleErrors)
      .then(res => res.json())
      .then(res => {
        const lang = navigator.languages && navigator.languages[0]
        res.createdAt = `${new Date(res.createdAt).toLocaleDateString(lang)}  ${new Date(res.createdAt).toLocaleTimeString(lang)}`
        res.updatedAt = `${new Date(res.updatedAt).toLocaleDateString(lang)}  ${new Date(res.updatedAt).toLocaleTimeString(lang)}`
        if (res.deletedAt) {
          res.deletedAt = `${new Date(res.deletedAt).toLocaleDateString(lang)}  ${new Date(res.deletedAt).toLocaleTimeString(lang)}`
        }
        
        let prettyRes = ''
        Object.keys(res).forEach(key => {prettyRes+=`${key}: ${res[key]}\n`})
        alert(prettyRes)
      })
      .catch(err => {
        alert(err)
      })
  }

  function getAccessToken() {
    return userId === file.userId && file.accessToken
  }

  function toggleAccess() {
    updateOrDelete('/api/files/toggleAccess', 'PUT')
  }

  function deleteFile() {
    updateOrDelete('/api/files/delete', 'DELETE')
  }

  function updateOrDelete(uri, method) {
    const data = {
      reqUserId: userId,
      userId: file.userId,
      filename: file.filename,
      accessToken: getAccessToken()
    }
    fetch(uri, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(handleErrors)
    .then(res => res.json())
    .then(file => {
        setUpdatedFile(file)
    }).catch(err => {
      alert(err)
    })
  }
  
  const getUserById = (userId) => users.find(user => user.id === userId)
  return (
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
      <div style={{flex: '1'}}>
        <span className={file.isDeleted && 'decorationLine'}>{file.filename} {` - (User: ${getUserById(file.userId).name})`}</span>
      </div>
      
      <button onClick={download}>Download</button>
      <button onClick={toggleAccess}>{file.isPrivate ? 'Unlock' : 'Lock'}</button>
      <button onClick={getMetadata}>Metadata</button>
      <button onClick={deleteFile}>Delete</button>
    </div>
  );
}

export default FileComponent;
