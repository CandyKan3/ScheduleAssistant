import React, { useState } from "react";

export default function Test() {
  const [email, setEmail] = useState("");
  const [class1, setClass] = useState("");
  const [response, getResponse] = useState("");

  const setRedirect = () => {};

  function handleSubmit2(event) {
    event.preventDefault();
    const data = { email: email, class: class1 };
    console.log(data);
    fetch("/api/createclass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) =>
        res.json().then((data) => {
          let data2 = data.message;
          getResponse(data2);
        })
      )
      .then(setRedirect);
  }

  return (
    <React.Fragment>
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
          <div>
            <img
              class="mx-auto  w-auto"
              src="https://image.freepik.com/free-vector/boy-studying-with-book_113065-238.jpg"
              alt="Workflow"
            />
            <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
              Welcome!
            </h2>
            <p class="mt-2 text-center text-sm leading-5 text-gray-600">
              Please enter your email to be alerted when a section opens
              Currently available for UNCC students only. Please enter the FULL
              course name.
            </p>
          </div>
          <form class="mt-8" onSubmit={handleSubmit2}>
            <input type="hidden" name="remember" value="true" />
            <div class="rounded-md shadow-sm">
              <div>
                <input
                  aria-label="Email address"
                  name="email"
                  type="email"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md-b focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br></br>
              <div class="-mt-px">
                <input
                  aria-label="Password"
                  name="password"
                  type="text"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                  placeholder="Class Name"
                  value={class1}
                  onChange={(e) => setClass(e.target.value)}
                />
              </div>
            </div>

            <div class="mt-6">
              <button class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Alert Me!
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
