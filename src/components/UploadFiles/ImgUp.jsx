import React, {useContext, useState, useEffect} from 'react';

import LabelBottomNavigation from './LabelBottomNavigation';
import './ImgUp.css'

import { FilesContext } from '../../context/filesContext'

import { storage, firestore } from '../../Firebase/config'

import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function ImgUp () {

  const { seccion, propiedadQueSubeFotos, infoPropiedad} = useContext(FilesContext)

  const [urlDescarga, setUrlDescarga] = useState()
  const [fotosNombre, setFotosNombre] = useState()

  const nomFot = "fotos_" + seccion
  useEffect(()=> {
      setFotosNombre(nomFot)
  }, [nomFot])
  


  async function fileHandler (e) {
      const archivoLocal = e.target.files
      
      let array = []
      for (let index = 0; index < archivoLocal.length; index++) {
          const element = archivoLocal[index];
          const archivoRef = ref(storage, `fotografias/${element.name}`)
          await uploadBytes(archivoRef, element)
          const urlDesc = await getDownloadURL(archivoRef)
          array.push(urlDesc)
      }
      setUrlDescarga(array)
  }
  
   async function añadirFotosApropiedad(e){
      e.preventDefault()
      const descripcion = e.target.placeComent.value
      const nuevoArrayPropiedad = 
          {
              ...infoPropiedad,
              [fotosNombre]: {
                  comentarios: descripcion,
                  fotos: urlDescarga
              }
          }
      

      const docuRef = doc(firestore, `contratos/${propiedadQueSubeFotos}`)
      await updateDoc(docuRef, nuevoArrayPropiedad)
      e.target.placeComent.value = ""
  }


  console.log(urlDescarga)
  console.log(infoPropiedad)
  console.log(propiedadQueSubeFotos)

  return (
    <div id = "div2">
        <h1 id='categoria'>{seccion} </h1>
        <LabelBottomNavigation/>
        <form onSubmit={añadirFotosApropiedad}>
            <h1 id='imagenes'> Imágenes </h1>
            <label htmlFor="file-upload" class="custom-file-upload">Subir Imagenes</label>
            <input  type="file" id="file-upload" accept='image/*' multiple onChange={fileHandler}></input>
            <p id='comentarios'> Comentarios </p>
            <input id='placeComent' type="text" placeholder='Agrega aqui tu comentario' />
            <p>sube tus imágenes</p>
            <button type='submit' id='guardar'>Guardar imágenes</button>
        </form>
    </div>
  );
}

/* return (
    <div id = "div2">
        <h1 id='categoria'>{seccion} </h1>
        <LabelBottomNavigation/>
        <form onSubmit={añadirFotosApropiedad}>
            <p > Comentarios </p>
            <input id='descripcion' type="text" placeholder='Agrega aqui tu comentario' />
            <p>sube tus imágenes</p>
            <input  type="file" accept='image/*' multiple onChange={fileHandler}></input>
            <button type='submit'>Guardar imágenes</button>
        </form>
    </div>
  ); */