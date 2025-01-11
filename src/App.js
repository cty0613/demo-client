import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [strength, setStrength] = useState(0.7);
  const [steps, setSteps] = useState(50);
  const [cfgScale, setCfgScale] = useState(7.0);
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
        const base64Image = reader.result.split(",")[1]; // Remove Base64 prefix

        // Prepare payload
        const payload = {
          init_images: [base64Image],
          prompt,
          strength,
          steps,
          cfg_scale: cfgScale,
        };

        // Send request to Stable Diffusion API
        const response = await fetch("/sdapi/v1/img2img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setGeneratedImage(data.images[0]);
      };

      reader.readAsDataURL(image);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Stable Diffusion img2img</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Prompt:
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              required
              style={{ width: "300px", margin: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Strength (0.0 - 1.0):
            <input
              type="number"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
              min="0"
              max="1"
              step="0.1"
              required
              style={{ width: "100px", margin: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Steps:
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              min="1"
              max="100"
              required
              style={{ width: "100px", margin: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            CFG Scale:
            <input
              type="number"
              value={cfgScale}
              onChange={(e) => setCfgScale(parseFloat(e.target.value))}
              min="1"
              max="20"
              step="0.1"
              required
              style={{ width: "100px", margin: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ margin: "10px" }}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      <div style={{ marginTop: "20px" }}>
        {generatedImage && (
          <div>
            <h2>Generated Image</h2>
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt="Generated"
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
