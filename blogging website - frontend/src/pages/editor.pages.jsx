import React, { useContext, useState } from "react";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const EditorPage = () => {
  const {
    authState: { access_token },
  } = useContext(userContext);

  const [editorState, setEditorState] = useState("editor");
  return access_token === null ? (
    <Navigate to={"/sign-in"} />
  ) : editorState === "editor" ? (
    <BlogEditor />
  ) : (
    <PublishForm />
  );
};

export default EditorPage;
