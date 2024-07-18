import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationPage from "../common/page-animation";
import blogBanner from "../imgs/blog banner.png";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../common/firebase";
import toast, { Toaster } from "react-hot-toast";

const BlogEditor = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  const handleImageChange = (e) => {
    let file = e.target.files[0];

    if (file) {
      toast.loading("Uploading");
      setImage(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleBannerUpload = () => {
    const storage = getStorage(app);
    const date = new Date();

    const fileName = `${image.name}-${date.getTime()}`;
    const storageRef = ref(storage, `images/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageURL(null);
        setImage(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
          toast.dismiss();
          toast.success("Uploaded");
          // setImage(downloadURL);
          // console.log(downloadURL);
          // setFormData({ ...formData, profilePicture: downloadURL });
          // setImageFileUploading(false);
        });
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px"
  }

  useEffect(() => {
    if (image) {
      handleBannerUpload();
    }
  }, [image]);

  return (
    <>
      <nav className="navbar">
        <Link to={"/"} className="w-10 flex-none">
          <img src={logo} className="w-full" />
        </Link>

        <p className=" max-md:hidden text-black line-clamp-1 w-full">
          New Blog
        </p>

        <div className="flex ml-auto gap-4">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <Toaster />

      <AnimationPage>
        <section>
          <div className=" max-w-[900px] w-full mx-auto">
            <div className="relative aspect-video border-4 border-grey rounded-lg">
              <label htmlFor="uploadBanner">
                <img
                  src={imageURL || blogBanner}
                  alt="blogBanner"
                  className="z-20"
                />
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  id="uploadBanner"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <textarea
            placeholder="Blog title"
            className="w-full h-20 mt-10 text-4xl font-medium resize-none outline-none leading-tight placeholder:opacity-40"
            onKeyDown={handleKeyDown}
            onChange={handleTitleChange}
          ></textarea>
        </section>
      </AnimationPage>
    </>
  );
};

export default BlogEditor;
