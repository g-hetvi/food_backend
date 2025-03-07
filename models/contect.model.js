const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  contact_no: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit contact number!`
    }
  },
  email: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;