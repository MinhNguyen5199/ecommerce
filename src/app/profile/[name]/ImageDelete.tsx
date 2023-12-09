export const ImageDelete = async (publicId: string) => {
  const paramsToSign = {
    timestamp: Math.round(new Date().getTime() / 1000),
    public_id: publicId,
  };

  const response = await fetch("/api/generateSignature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paramsToSign),
  });

  const { signature } = await response.json();

  const deleteResponse = await fetch(
    "https://api.cloudinary.com/v1_1/" +
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
      "/image/destroy",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_id: paramsToSign.public_id,
        signature,
        timestamp: paramsToSign.timestamp,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      }),
    }
  );

  const deleteData = await deleteResponse.json();
  console.log(deleteData);
};