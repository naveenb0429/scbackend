import React, { useState } from "react";
import {renderErrorMessage} from "../dashboard/utils";

const Demo = () => {
  const initialFormData= {
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    enquiry: "",
  }
  const [errorMessages, setErrorMessages] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessages({});
    fetch("/server/accounts/submit-enquiry/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((response) => {
      return new Promise((resolve) => response.json()
          .then((json) => resolve({
            status: response.status,
            json,
          })));
    }).then(({status, json}) => {
      if (status !== 200) {
        setErrorMessages(json);
      } else {
        setErrorMessages({detail: 'Your request is submitted successfully'})
        const form = document.getElementById("enquiry-form");
        setFormData(initialFormData)
        form.reset()
      }
    });
  };

  return (
    <div
      className="max-w-7xl mx-auto my-14 px-7 leading-relaxed tracking-wide"
      id="product"
    >
      <p className="font-bold max-w-xl xl:text-3xl text-softprimary">
        Begin your carbon credits journey with SustainCred
      </p>
      <p className="xl:text-4xl font-bold">Book a free demo now</p>

      <form className="my-5 space-y-5" name="enquiry-form" id="enquiry-form" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            minLength={3}
            maxLength={50}
            value={formData.firstName}
            onChange={handleInputChange}
            className="rounded-full border border-black outline-none focus:outline-none p-2.5 w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            maxLength={50}
            value={formData.lastName}
            onChange={handleInputChange}
            className="rounded-full border border-black outline-none focus:outline-none p-2.5 w-full"
          />
        </div>
        {renderErrorMessage('firstName', errorMessages, "text-red-400")}
        {renderErrorMessage('lastName', errorMessages, "text-red-400")}

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          minLength={3}
          maxLength={50}
          value={formData.companyName}
          onChange={handleInputChange}
          className="rounded-full border border-black outline-none focus:outline-none p-2.5 w-full"
        />
        {renderErrorMessage('companyName', errorMessages, "text-red-400")}

        <input
          type="email"
          name="email"
          placeholder="Business Email ID"
          minLength={3}
          maxLength={50}
          value={formData.email}
          onChange={handleInputChange}
          className="rounded-full border border-black outline-none focus:outline-none p-2.5 w-full"
        />
        {renderErrorMessage('email', errorMessages, "text-red-400")}

        <input
          type="number"
          name="phoneNumber"
          minLength={9}
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="rounded-full border border-black outline-none focus:outline-none p-2.5 w-full"
        />
        {renderErrorMessage('phoneNumber', errorMessages, "text-red-400")}

        <textarea
          name="enquiry"
          className="resize-none focus:outline-none outline-none border border-black w-full p-2.5 rounded-xl"
          cols="30"
          rows="10"
          minLength={10}
          maxLength={500}
          placeholder="What are you looking for?"
          value={formData.enquiry}
          onChange={handleInputChange}
        ></textarea>
        {renderErrorMessage('enquiry', errorMessages, "text-red-400")}

        <button
          className="w-full bg-softprimary text-white rounded-full font-bold text-3xl py-2"
          type="submit"
        >
          Submit
        </button>
        {renderErrorMessage('detail', errorMessages, "text-red-400")}
      </form>
    </div>
  );
};

export default Demo;
