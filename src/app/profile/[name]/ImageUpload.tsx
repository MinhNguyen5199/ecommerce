// ImageUpload.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import ReactComponent from "*.svg";
import { set } from "firebase/database";
import { ImageDelete } from "./ImageDelete";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}


type ImageUploadProps = {
  setChildData?: (data: any) => void; // Use the correct type instead of `any` if possible
};

const ImageUpload: React.FC<ImageUploadProps> = ({ setChildData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    {
      url: string;
      name: string;
      size: number;
      publicId: string;
      progress: number;
      secureUrl?: string;
      unSecureUrl?: string;
    }[]
  >([]);
  const [imageUrl, setImageUrl] = useState('');
  // New function to handle URL changes
  const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  // New function to handle uploads from a URL
  const onUploadFromUrl = async () => {
    const urlPattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
    if (!urlPattern.test(imageUrl)) {
      alert('Please enter a valid image URL');
      return;
    }
  
    const paramsToSign = {
      timestamp: Math.round(new Date().getTime() / 1000),
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    };
  
    const response = await fetch("/api/generateSignature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paramsToSign),
    });
  
    const { signature } = await response.json();
  
    const uploadPreset = paramsToSign.upload_preset;
  
    if (!uploadPreset) {
      throw new Error("Upload preset is not defined");
    }
  
    const formData = new FormData();
    formData.append("file", imageUrl);
    formData.append("upload_preset", uploadPreset);
    formData.append("signature", signature);
    formData.append("timestamp", paramsToSign.timestamp.toString());
    if (process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY !== undefined)
      formData.append(
        "api_key",
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
      );
    formData.append("quality", "auto:eco");
  
    const uploadResponse = await axios.post(
      "https://api.cloudinary.com/v1_1/" +
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
        "/image/upload",
      formData
    );
  
    const imageData = uploadResponse.data;
    const newImage = {
      url: imageData.url,
      name: 'Image from URL',
      size: imageData.bytes,
      publicId: imageData.public_id,
      progress: 100,
      secureUrl: imageData.secure_url,
      unSecureUrl: imageData.url,
    };
  
    setSelectedImages((prevImages) => [...prevImages, newImage]);
    setImageUrl('');
  };
  const handleUploadFromUrl = async () => {
    if (isLoading) {
      return;
    }
  
    setIsLoading(true);
    await onUploadFromUrl();
    setIsLoading(false);
  };

  const onImageChange = async (event: any) => {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      for (const file of files) {
        const newImage: {
          url: string;
          name: string;
          size: number;
          publicId: string;
          progress: number;
          secureUrl?: string;
          unSecureUrl?: string;
        } = {
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          publicId: "",
          progress: 0,
        };
        setSelectedImages((prevImages) => [...prevImages, newImage]);
        const paramsToSign = {
          timestamp: Math.round(new Date().getTime() / 1000),
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        };

        const response = await fetch("/api/generateSignature", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paramsToSign),
        });

        const { signature } = await response.json();

        const uploadPreset = paramsToSign.upload_preset;

        if (!uploadPreset) {
          throw new Error("Upload preset is not defined");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        formData.append("signature", signature);
        formData.append("timestamp", paramsToSign.timestamp.toString());
        if (process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY !== undefined)
          formData.append(
            "api_key",
            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
          );
        formData.append("quality", "auto:eco");

        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/" +
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
            "/image/upload",
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                newImage.progress = percentCompleted;
                setSelectedImages((prevImages) =>
                  prevImages.map((image) =>
                    image.url === newImage.url ? newImage : image
                  )
                );
              }
            },
          }
        );

        const imageData = uploadResponse.data;
        newImage.publicId = imageData.public_id;
newImage.secureUrl = imageData.secure_url;
newImage.unSecureUrl = imageData.url;
        console.log(newImage);
        setSelectedImages((prevImages) =>
          prevImages.map((image) =>
            image.url === newImage.url ? newImage : image
          )
        );
      }
    }
  };

  const deleteImage = async (publicId: string) => {
    ImageDelete(publicId);
    
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image.publicId !== publicId)
    );
  };

  useEffect(() => {
    if (selectedImages[0]?.progress === 100) {
      if (setChildData) {
        setChildData(selectedImages);
      }
    }
  }, [selectedImages, setChildData]);
  
  return (
    <div>
      <div className="flex flex-wrap">
      <input type="file" className="text-black my-2" onChange={onImageChange} multiple />
      <input type="text" value={imageUrl} onChange={onUrlChange} placeholder="Paste image URL here" className="h-6"  />
      {isLoading===false ?(<div><p className="text-black ml-2 inline hover:text-blue-500 hover:underline hover:decoration-blue-500 hover:opacity-80 hover:cursor-pointer mt-[2px] text-[15px]" onClick={handleUploadFromUrl}>Upload from URL</p></div>):(<div className="text-black ml-2 inline mt-[2px] text-[15px]">Loading.....</div>)
      }
      </div>
      {selectedImages.map((image, index) => (
        <div key={index}>
          <div className="flex items-center">
            <div className="w-full">
              <p className="text-black inline">
                <a className="hover:underline hover:text-blue-500 hover:cursor-pointer" href={image.secureUrl} target="_blank" rel="noopener noreferrer">
                  {image.name} ({formatBytes(image.size)})
                </a>
              </p>
            </div>
            {image.progress === 100 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="50"
                height="40"
                x="0px"
                y="0px"
                viewBox="0 0 64 64"
                enableBackground="new 0 0 64 64"
                xmlSpace="preserve"
              >
                <g id="success-outline-bot_x5F_s1g1_x5F_s2g1_x5F_s3g1_x5F_s4g2_x5F_background">
                  <g id="Layer_5"></g>

                  <circle
                    fill="#FFFFFFFF"
                    stroke="#12E84DFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    cx="32"
                    cy="32"
                    r="17.5"
                  />
                </g>
                <g id="success-outline-top_x5F_s1g1_x5F_s2g2_x5F_s3g1_x5F_s4g1">
                  <polyline
                    fill="none"
                    stroke="#4DE21FFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    points="   21.5,32 28.5,39 42.5,25  "
                  />
                </g>
              </svg>
            )}

            <p className="hover:cursor-pointer" onClick={() => deleteImage(image.publicId)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="50"
                height="40"
                x="0px"
                y="0px"
                viewBox="0 0 64 64"
                enableBackground="new 0 0 64 64"
                xmlSpace="preserve"
                className="hover:scale-110"
              >
                <g id="edit-outline-top_x5F_s1g1_x5F_s2g2_x5F_s3g1_x5F_s4g2">
                  <path
                    fill="none"
                    stroke="#536DFE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="   M37.444,19.092v-2.207c0-2.074-1.682-3.756-3.756-3.756h-3.377c-2.074,0-3.756,1.682-3.756,3.756v2.207"
                  />
                </g>
                <g id="edit-outline-bot_x5F_s1g1_x5F_s2g1_x5F_s3g1_x5F_s4g1_x5F_background">
                  <path
                    fill="#FFFFFF"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="   M48.482,21.551L48.482,21.551c0,1.358-1.247,2.459-2.787,2.46l-27.39,0.006c-1.54,0-2.788-1.101-2.788-2.46v-0.006   c0-1.358,1.248-2.46,2.787-2.46h27.39C47.235,19.092,48.482,20.193,48.482,21.551z"
                  />

                  <path
                    fill="#FFFFFF"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="   M18.427,42.902V24.017h27.147v18.884c0,4.401-3.568,7.969-7.969,7.969H26.396C21.995,50.871,18.427,47.303,18.427,42.902z"
                  />
                </g>
                <g id="edit-outline-top_x5F_s1g1_x5F_s2g2_x5F_s3g1_x5F_s4g1_x5F_background">
                  <g id="home-outline-first_x5F_s1g1_x5F_s2g1_x5F_s3g1_x5F_s4g1_1_"></g>

                  <line
                    fill="none"
                    stroke="#536DFE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    x1="26.556"
                    y1="29.461"
                    x2="28.371"
                    y2="43.979"
                  />

                  <line
                    fill="none"
                    stroke="#536DFE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    x1="37.88"
                    y1="29.461"
                    x2="36.066"
                    y2="43.979"
                  />
                </g>
              </svg>
            </p>
          </div>
          <div className="flex items-center">
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden ">
              <div
                className={`h-full transition-all duration-500 animate-pulse ${
                  image.progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${image.progress}%` }}
              ></div>
            </div>
            <p className="text-black ml-2 text-lg">{image.progress}%</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;
