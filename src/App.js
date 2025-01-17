import React, { useState } from "react";
import axios from "axios";
import "./Main.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [strength, setStrength] = useState(0.7);
  const [steps, setSteps] = useState(50);
  const [cfgScale, setCfgScale] = useState(7.0);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
      if (file) {
        setImage(file);
        const reader = new FileReader();
        console.log(reader);
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !prompt) {
      alert("Please upload an image and enter a prompt.");
      return;
    }

    setLoading(true);

    try {
      // Convert image file to Base64
      const reader = new FileReader();
      reader.onload = async () => {
        // Remove Base64 prefix
        const base64Image = reader.result.split(",")[1]; 

        // Prepare payload
        const payload = {
          init_images: [base64Image],
          prompt,
          negative_prompt: "Pixelated design, distorted facial features, blurry rendering, overly detailed skin texture, animal-like characteristics, sharp or harsh expressions, low-quality resolution, unrecognizable face, unnatural colors, 3D effects",
          strength,
          steps,
          cfg_scale: cfgScale,
        };

        try {
          const response = await axios.post("/sdapi/v1/img2img", payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          setGeneratedImage(response.data.images[0]);
          console.log(response.data);
        } catch (error) {
          console.error(error);
          alert("Failed to generate image. Check console for details.");
        }
      }
      
    reader.readAsDataURL(image);
    } catch (error) {
        console.error(error);
        alert("Failed to convert image to Base64. Check console for details.");
    } finally {
      setLoading(false);
    }

  }
 
  return (<div style={{ textAlign: "center", padding: "20px" }}>
    <h1>Stable Diffusion img2img</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          Prompt:
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            required
          />
        
      </div>
      <div className="form-group">
        <label>
          Strength (0.0 - 1.0):
        </label>
          <input
            type="number"
            value={strength}
            onChange={(e) => setStrength(parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.1"
            required
          />
      </div>
      <div className="form-group">
        <label>
          Steps:
        </label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value, 10))}
            min="1"
            max="100"
            required
          />
        
      </div>
      <div className="form-group">
        <label>
          CFG Scale:
        </label>
          <input
            type="number"
            value={cfgScale}
            onChange={(e) => setCfgScale(parseFloat(e.target.value))}
            min="1"
            max="20"
            step="0.1"
            required
          />
        
      </div>
      <div className="form-group image-upload">
        <div className="sub-form">
          <div>Input Image</div>
            {preview ? (
              <img 
                src={preview}
                alt=""
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            ) : (
              <div className="noimg"></div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
        </div>
        <div className="sub-form">
          <div>Generated Image</div>
          {loading && <div>Loading...</div>}
          {generatedImage && (
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt=""
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          )}
        </div>
      </div>
      <button type="submit" disabled={loading}> GENERATE !</button>
    </form>
  </div>
  );
}

export default App;
