import { useState } from "react";
import { renderErrorMessage } from "../../utils/utils";

const NewsLetter = () => {
    const [errorMessages, setErrorMessages] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            email: document.getElementById("email").value
        }
        setErrorMessages({});
        fetch("/server/accounts/news-letter/", {
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
        }).then(({ status, json }) => {
            if (status !== 200) {
                setErrorMessages(json);
            } else {
                setErrorMessages({ detail: 'Your request is submitted successfully' })
                const form = document.getElementById("newsletter-form");
                form.reset()
            }
        });
    };
    return (
        <div className="max-w-4xl mx-auto mb-32 px-5">
            <h1 className="font-bold xl:text-5xl tracking-wide">
                <span className="font-outline-2 leading-relaxed">Sign up to our</span>{" "}
                <br /> <span>newsletter</span>
            </h1>
            <form className="flex items-center justify-center space-x-5 mt-10" id="newsletter-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="focus:outline-none outline-none border-b-2 w-full"
                />
                {renderErrorMessage('email', errorMessages, "text-red-400")}
                <button className="bg-darksecondary text-white rounded px-5 py-2.5" type='submit'>Join</button>
            </form>
            {renderErrorMessage('detail', errorMessages, "text-red-400")}
            <p className="text-sm mt-5">By signing up you accept our Privacy Policy</p>
        </div>

    )
}

export default NewsLetter