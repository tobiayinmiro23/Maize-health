import { useState } from 'react'
import './App.css'
import Card from './Card';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from './firebase';

function App() {
  const storage = getStorage();
  const [file, setfile] = useState('')
  const [loading, setloading] = useState(false)
  const [img_url, setimg_url] = useState(null)
  const [pestData, setpestData] = useState([])
  const [dataReady, setdataReady] = useState(false)

  console.log(file)
  //function to analyzes image for pests
  const getPest = (img) => {
    fetch(`https://serverless.roboflow.com/dr.mangosteen/1?api_key=ejpzvlfUff7irWmzswU5&image=${img}`)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setloading(false)
        setpestData(response)
        setdataReady(true)
      })
      .catch(error => {
        console.log(error);
        setloading(false)
        // alert(error.message);
        alert('network error, please try again later');
      });
  }
  //uploads image to firebase get the image link and analyze it fiir pests
  const upload = () => {
    setpestData([])
    setdataReady(false)
    setloading(true)
    const storageRef = ref(storage, `${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress)
      },
      (error) => {
        setloading(false)
        // alert(error?.message || 'an error occured,try again later')
        alert('network error, please try again later');        
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL)
          getPest(downloadURL)
        }).catch(error => {
          setloading(false)
          // alert(error?.message || 'an error occured,try again later')
        alert('network error, please try again later');
          
        })
      }
    );
  }
  // displays the selected image
  const getImgUrl = (e) => {
    setfile(e.target.files[0])
    const data = new FileReader()
    data.addEventListener('load', () => {
      setimg_url(data.result)
    })
    data.readAsDataURL(e.target.files[0])
  }

  return (
    <>
      <h1>Maize Pesticide Recommender</h1>
      <div className='holder'>
        <div className='img'><img src={img_url} alt="maize image" /></div>
        <label className='' >
          <h3>select an image</h3>
        </label>
        <div >
          <input type="file" name="upload" accept="image/*" className='upload' onInput={getImgUrl
          } id="" />
          {file != '' && <button disabled={loading} onClick={upload}>{loading ? 'Loading...' : 'Scan image'}</button>
          }
        </div>
        {dataReady && <Card pestData={pestData} />}
      </div>
    </>
  )
}

export default App
