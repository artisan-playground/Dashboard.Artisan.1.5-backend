// import {test} from './server'
import express = require('express');
// const { Pool, Client } = require('pg')
import server from './configs/server';
import client from "./repository/condb";
import { Request, Response } from 'express'

const app = express();
// import dotenv from 'dotenv'
// dotenv.config()

const connectServer = async () => {


  try {

    await client.connect()

    try{

      const Email = "thanwimol@artisan.co.th"


      // const sql = `INSERT INTO public.test (name, password, email) VALUES ('${user}'::character varying, '${pass}'::character varying, '${email}'::character varying)`
      const se = `SELECT * FROM "User"`
      // console.log(sql);
      // Execute yo Database Language SQL

      client.query(se,function (err:string, result:any, fields:string,email:string) {
        if (err) throw err;
       email =  result.rows[0].email;

        if(Email == email ){

        console.log('new query succes for email ');

        console.log("ผลลัพธ์ = ",result.rows[0].email);

        const display : any ={
          // message: `ซ้ำ`,
          message: `Send ot email success`,
          responseCode: 200,


        }

          return display



        }
        else{
          console.log('ไม่สำเร็จ');
          console.log("ผลลัพธ์ = ",result.rows[0].email);
          console.log(err);
          const display : any ={
            // message: `ซ้ำ`,
            message: `not success`,
             responseCode: 200,


          }

            return display

        }



      });
      console.log("Success");


    }
    catch(error){
      console.log("error");

    }



    const PORT = 8000;
    server.applyMiddleware({ app });

    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  }
  catch(error){
    console.log(error);

  }


}

connectServer()


export default connectServer












