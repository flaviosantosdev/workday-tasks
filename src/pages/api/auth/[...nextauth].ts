
import { profile } from "console";
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import firebase from "../../../services/firebaseConnection";

export default NextAuth({
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_SECRET,
         
        }),
       
      ],
      secret:process.env.SECRET,

   
      callbacks: {
        async signIn({ user, account, profile, email}) {
          return true
        },
      
        async session({ session, user, token }) {
          
          try{

            const lastDonate = await firebase.firestore().collection('users')
            .doc(String(token.sub))
            .get()
            .then((snap) => {
              if(snap.exists){
                return snap.data().lastDOnate.toDate()
              }else{
                return null
              }
            })
            return{
              ...session,
              id:token.sub,
              vip:lastDonate ? true : false,
              lastDonate: lastDonate
            }
          }catch{
            return {
              ...session,
            id:null,
            vip:true,
            lastDonate:null
            }
          }

        },
      }

})