const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   user_name: {
      type: String,
      required: true
   },
   user_about: {
      type: String,
      required: false,
   },
   user_profession: {
      type: String,
      required: false,
   },
   user_age: {
      type: Number,
      required: false,
   },
   user_emailId: {
      type: String,
      required: true,
   },
   user_gender: {
      type: String,
      required: false
   },
   user_bio: {
      type: String,
      required: false
   },
   user_genderPreference: {
      type: String,
      required: false,
   },
   user_isAuthorised: {
      type: Boolean,
      default: false
   },
   user_type: {
      type: String,
      required: false,
   },
   user_image: {
      type: String,
      required: false,
   },
   user_coin: {
      type: Number,
      required: false,
   },
   user_country: {
      type: String,
      required: false
   },
   user_countryCode:{
      type: String,
      required: false
   },
   user_isBlock:{
      type: Boolean,
      default: false
   },
   user_coinLog: {
      items: [
         {
            transactionId: {
               type: String,
               required: true,
            },
            coinAmount: {
               type: Number
            },
            remark: {
               type: String
            },
            date: {
               type: String
            },
            time: {
               type: String
            }
         }
      ]
   },
   user_wallet: {
      type: Number,
      required: false,
   },
   google_id: {
      type: String,
      required: false,
   },
   is_Active: {
      type: Boolean,
      required: false
   },
   user_walletLog: {
      items: [
         {
            transactionId: {
               type: String,
               required: true,
            },
            walletAmount: {
               type: Number
            },
            remark: {
               type: String
            },
            date: {
               type: String
            },
            time: {
               type: String
            }
         }
      ]
   },
   user_favrateLog:{
      items: [
         {
            favouriteUserId: {
               type: String,
               required: false,
            }
         }
      ]
   },
   user_blockLog:{
      items: [
         {
            blockUserId: {
               type: String,
               required: false,
            },
            remark:{
               type: String,
               required: false,
            }
         }
      ]
   }
}, { timestamps: true }
);

module.exports = mongoose.model('tblusers', userSchema);

































