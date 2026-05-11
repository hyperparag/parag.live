import Footer from "@/component/footer/footer2";
import Header from "@/component/header/header";
import PostForm from "@/component/postForm/postForm";
import React from "react";

const PostsAhad = () => {
  return (
    <div className="page-bg">
      <Header />
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "32px 16px",
        }}
      >
        <div
          className="themed-card"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "var(--shadow)",
          }}
        >
          <PostForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostsAhad;
