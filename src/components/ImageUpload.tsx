import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Monster = {
  name:string,
  description:string,
  avgHeight:string,
  diet:string,
  environment:string,
}

function ImageUpload() {
  // Create state to store file
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState("");
  const [monster, setMonster] = useState<Monster>();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file as Blob);
    const resp = await fetch(`http://localhost:4321/api/analyze-monster`, {
      method: "POST",
      body: file,
    })

    const response = await resp.json();
    const m = JSON.parse(response.monster);
    setMonster(m);
    setImage(response.image);
    console.log(response);
    // setImage(response.image);
    // setDesc(response.desc);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <div className="App">
      <div>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        <img src={image} alt="" />
        <div>
          <h2>Monster</h2>
          <Markdown remarkPlugins={[remarkGfm]}>
            {`
              | Name | Description | Avg Height | Diet | Environment |
              | ---- | ----------- | --------- | ---- | ----------- |
              | ${monster?.name} | ${monster?.description} | ${monster?.avgHeight} | ${monster?.diet} | ${monster?.environment} |
            `}
          </Markdown>
        </div>
      </div>
    </div>
  );
}


export default ImageUpload;