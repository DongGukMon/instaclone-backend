import client from "../../client";
import bcrypt from 'bcrypt';
import { protectedResolver } from "../user.utils";

import {createWriteStream} from 'fs';

import GraphQLUpload from "graphql-upload/GraphQLUpload.js";


const editProfileFn = async (_,{firstName,lastName,username,email,password:newPassword,bio,avatar},{loggedInUser}) =>{

    if(avatar){
        const {filename,createReadStream} = await avatar;
        console.log(filename,createReadStream);
        const readStream = createReadStream()
        const writeStream = createWriteStream(process.cwd() + '/uploads' + '/' +filename)
        readStream.pipe(writeStream);
    }
    

    let uglyPassword = null
    if(newPassword){
        uglyPassword = await bcrypt.hash(newPassword,10);
    }

    const updatedUser = await client.user.update({
        where:{
            id:loggedInUser.id
        },
        data:{
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(uglyPassword && {password:uglyPassword})
        }
    })
    if (updatedUser.id){
        return {
            ok:true
        }
    } else {
        return {
            ok: false,
            error: "Could not update profile."
        }
    }
}

export default {
    Upload: GraphQLUpload,
    Mutation: {
        editProfile: protectedResolver(editProfileFn)
    }
}