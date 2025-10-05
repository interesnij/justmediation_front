import { FILES_API, API } from "helpers";
//import { parse } from "fast-xml-parser";


export const uploadFiles = async (
  files,
  folder:
    | "user_avatars"
    | "forum_icons"
    | "documents"
    | "esign"
    | "chats_images"
    | "mediator_registration_attachments"
    | "voice_consents"
    | "mediator_posts"
    | "team_logo"
    | "other"
  ,
  object_id
) => {
  const files_res : string[] = [];

  try { 
    let formData = new FormData();
    formData.append("token", "key_BUVEnKnbfbddfdf_gggg_fbfbf_XXBcLGdyg3ZdsO6JCPG5kh947MPjy");
    formData.append("folder", folder);
    formData.append("object_id", object_id);
    //formData.append("file", files);
    for (let i = 0; i < files.length; i++) {
      console.log("upload", files[i]);
      formData.append("file", files[i]);
    }
    const _url = 'https://k.juslaw.site/classic_create/';
    //const token = localStorage.getItem("key");
    const res = await fetch(_url, {
      headers: { 
        //'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        //Origin: "https://app.justmediationhub.com",
      },
      method: 'POST',
      mode: "cors",
      body: formData
    });
    const text = await res.text();
    const data = JSON.parse(text);
    const res_files = data["files"];
    for (let i = 0; i < res_files.length; i++) {
      console.log("i", res_files[i]);
      files_res.push(res_files[i]);
    } 
    
    //files_res.push(data["files"]);
    console.log(data["files"]);
    console.log("url", _url);
    //console.log(parse(res.toString()).PostResponse.Location);
    return files_res;
  } 

  catch (error) {
    return [];
  }
};