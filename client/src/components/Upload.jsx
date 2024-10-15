import React, { useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";

const urlEndpoint = import.meta.env.VITE_URLENDPOINT;
const publicKey = import.meta.env.VITE_PUBLICKEY;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/upload");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    ("Authentication request failed: ", error);
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImage }) => {
  const ikUploadRef = useRef(null);

  const onError = (err) => {
    ("Error", err);
  };

  const onSuccess = (res) => {
    ("Success", res);
    setImage((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress) => {
    ("Progress", progress);
  };

  const onUploadStart = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };
  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />

      <label onClick={() => ikUploadRef.current.click()}>
        <img
          src="/addimage.png"
          alt="uploadimages"
          className="w-5 hn , cursor-pointer"
        />
      </label>
    </IKContext>
  );
};

export default Upload;
